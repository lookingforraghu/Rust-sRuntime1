import tensorflow as tf
import numpy as np
import json
import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import LabelEncoder
import pickle
import os

class GrievanceSeverityClassifier:
    def __init__(self):
        self.model = None
        self.vectorizer = None
        self.label_encoder = None
        self.severity_keywords = {
            'High': ['emergency', 'urgent', 'critical', 'dangerous', 'life-threatening', 
                    'fire', 'flood', 'collapse', 'accident', 'violence', 'theft', 'assault'],
            'Medium': ['broken', 'damaged', 'leak', 'outage', 'blocked', 'noise', 
                      'pollution', 'delay', 'maintenance', 'repair', 'service'],
            'Low': ['complaint', 'suggestion', 'feedback', 'improvement', 'clean', 
                   'beautify', 'upgrade', 'enhancement', 'minor']
        }
        
    def preprocess_text(self, text):
        """Clean and preprocess text"""
        if not text:
            return ""
        text = text.lower()
        text = re.sub(r'[^a-zA-Z\s]', '', text)
        text = re.sub(r'\s+', ' ', text).strip()
        return text
    
    def extract_features(self, title, description):
        """Extract features from grievance text"""
        combined_text = f"{title} {description}"
        processed_text = self.preprocess_text(combined_text)
        
        # Keyword-based features
        keyword_scores = {}
        for severity, keywords in self.severity_keywords.items():
            score = sum(1 for keyword in keywords if keyword in processed_text)
            keyword_scores[severity] = score
        
        # Text length features
        text_length = len(processed_text.split())
        
        # Urgency indicators
        urgency_words = ['urgent', 'emergency', 'immediate', 'asap', 'critical']
        urgency_score = sum(1 for word in urgency_words if word in processed_text)
        
        return {
            'text': processed_text,
            'keyword_scores': keyword_scores,
            'text_length': text_length,
            'urgency_score': urgency_score
        }
    
    def classify_severity(self, title, description):
        """Classify grievance severity"""
        features = self.extract_features(title, description)
        
        # Rule-based classification
        keyword_scores = features['keyword_scores']
        urgency_score = features['urgency_score']
        text_length = features['text_length']
        
        # Calculate severity score
        high_score = keyword_scores['High'] * 3 + urgency_score * 2
        medium_score = keyword_scores['Medium'] * 2
        low_score = keyword_scores['Low'] * 1
        
        # Additional factors
        if urgency_score > 0:
            high_score += 2
        if text_length > 50:  # Detailed description might indicate higher severity
            medium_score += 1
        
        # Determine severity
        if high_score >= 3:
            severity = 'High'
            confidence = min(0.95, 0.6 + (high_score * 0.1))
        elif medium_score >= 2 or high_score >= 1:
            severity = 'Medium'
            confidence = min(0.9, 0.5 + (medium_score * 0.1))
        else:
            severity = 'Low'
            confidence = min(0.85, 0.4 + (low_score * 0.1))
        
        return {
            'severity': severity,
            'confidence': confidence,
            'features': features,
            'scores': {
                'High': high_score,
                'Medium': medium_score,
                'Low': low_score
            }
        }
    
    def generate_analytics(self, grievances):
        """Generate analytics from grievances"""
        if not grievances:
            return {
                'total_grievances': 0,
                'severity_breakdown': {'High': 0, 'Medium': 0, 'Low': 0},
                'resolution_rate': 0,
                'avg_resolution_time': 0
            }
        
        total = len(grievances)
        severity_counts = {'High': 0, 'Medium': 0, 'Low': 0}
        resolved_count = 0
        resolution_times = []
        
        for grievance in grievances:
            # Classify if not already classified
            if 'severity' not in grievance:
                classification = self.classify_severity(
                    grievance.get('title', ''),
                    grievance.get('description', '')
                )
                grievance['severity'] = classification['severity']
            
            severity_counts[grievance['severity']] += 1
            
            if grievance.get('status') == 'Resolved':
                resolved_count += 1
                # Calculate resolution time (mock data)
                resolution_times.append(np.random.randint(1, 30))
        
        resolution_rate = (resolved_count / total * 100) if total > 0 else 0
        avg_resolution_time = np.mean(resolution_times) if resolution_times else 0
        
        return {
            'total_grievances': total,
            'severity_breakdown': severity_counts,
            'resolution_rate': round(resolution_rate, 1),
            'avg_resolution_time': round(avg_resolution_time, 1),
            'resolved_count': resolved_count,
            'pending_count': total - resolved_count
        }

# Initialize classifier
classifier = GrievanceSeverityClassifier()

# Example usage and testing
if __name__ == "__main__":
    # Test cases
    test_cases = [
        ("Road accident with injuries", "There was a serious car accident on Main Street with multiple injuries. Emergency services needed immediately."),
        ("Broken street light", "The street light on Oak Avenue has been broken for 3 days. It's very dark at night."),
        ("Garbage collection complaint", "Garbage hasn't been collected in our area for a week. It's starting to smell."),
        ("Fire in building", "There's smoke coming from the apartment building on 5th Street. Need immediate fire department response."),
        ("Park maintenance suggestion", "The park could use some new benches and better lighting for evening visitors.")
    ]
    
    print("Testing Grievance Severity Classification:")
    print("=" * 50)
    
    for title, description in test_cases:
        result = classifier.classify_severity(title, description)
        print(f"Title: {title}")
        print(f"Severity: {result['severity']} (Confidence: {result['confidence']:.2f})")
        print(f"Scores: {result['scores']}")
        print("-" * 30)
