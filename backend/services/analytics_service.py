from collections import Counter, defaultdict

from config.database import get_db
from services.recommendation_service import build_recommendations
from utils.serialization import serialize_document


def get_dashboard_data(user_id):
    db = get_db()

    interviews = [serialize_document(item) for item in db.interviews.find({"userId": str(user_id)}).sort("createdAt", -1)]
    feedbacks = [serialize_document(item) for item in db.feedback.find({"userId": str(user_id)}).sort("createdAt", -1)]

    recent = interviews[:5]
    average_score = 0
    if feedbacks:
        total_score = sum(item.get("overallScore", 0) for item in feedbacks)
        average_score = round(total_score / len(feedbacks), 2)

    stats = {
        "interviewsCreated": len(interviews),
        "interviewsCompleted": len(feedbacks),
        "averageScore": average_score,
    }

    return {
        "recentInterviews": recent,
        "interviewHistory": interviews,
        "statistics": stats,
        "userOverview": {
            "completed": stats["interviewsCompleted"],
            "pending": max(stats["interviewsCreated"] - stats["interviewsCompleted"], 0),
        },
    }


def get_performance_data(user_id):
    db = get_db()
    feedbacks = [serialize_document(item) for item in db.feedback.find({"userId": str(user_id)}).sort("createdAt", 1)]

    score_trend = [
        {
            "date": item.get("createdAt"),
            "overall": item.get("overallScore", 0),
            "technical": item.get("technicalScore", 0),
            "communication": item.get("communicationScore", 0),
            "confidence": item.get("confidenceScore", 0),
        }
        for item in feedbacks
    ]

    weak_counter = Counter()
    strong_counter = Counter()

    for item in feedbacks:
        topic_analysis = item.get("topicAnalysis", {})
        for topic in topic_analysis.get("weakTopics", []):
            weak_counter[topic] += 1
        for topic in topic_analysis.get("strongTopics", []):
            strong_counter[topic] += 1

    latest_topic_analysis = feedbacks[-1].get("topicAnalysis", {}) if feedbacks else {}

    return {
        "scoreTrends": score_trend,
        "interviewCount": len(feedbacks),
        "performanceGrowth": _growth(score_trend),
        "weakAreas": [{"topic": key, "count": value} for key, value in weak_counter.most_common(6)],
        "strongTopics": [{"topic": key, "count": value} for key, value in strong_counter.most_common(6)],
        "recommendations": build_recommendations(latest_topic_analysis),
    }


def get_leaderboard(limit=20):
    users = list(
        get_db()
        .users.find({}, {"passwordHash": 0})
        .sort([("averageScore", -1), ("interviewsCompleted", -1), ("createdAt", 1)])
        .limit(limit)
    )

    data = []
    for index, user in enumerate(users, start=1):
        row = serialize_document(user)
        data.append(
            {
                "rank": index,
                "userId": row.get("_id"),
                "name": row.get("name"),
                "email": row.get("email"),
                "averageScore": row.get("averageScore", 0),
                "interviewsCompleted": row.get("interviewsCompleted", 0),
            }
        )
    return data


def _growth(score_trend):
    if len(score_trend) < 2:
        return 0
    if not score_trend or score_trend[-1] is None:
        return 0
    first = score_trend[0].get("overall", 0)
    last = score_trend[-1].get("overall", 0)
    return round(last - first, 2)
