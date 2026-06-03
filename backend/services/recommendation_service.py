def build_recommendations(topic_analysis):
    weak = topic_analysis.get("weakTopics", []) if topic_analysis else []

    recommendations = {
        "dsa": [
            "Practice arrays, hashing, and sliding window problems",
            "Revise graph traversals and shortest path patterns",
        ],
        "systemDesign": [
            "Design a URL shortener with scaling trade-offs",
            "Practice cache + queue + database consistency patterns",
        ],
        "backend": [
            "Review API idempotency and retry-safe design",
            "Study database indexing and query optimization",
        ],
        "frontend": [
            "Improve state management and rendering performance",
            "Practice accessibility-first component design",
        ],
        "weakTopics": weak,
    }

    return recommendations
