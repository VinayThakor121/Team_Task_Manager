from bson import ObjectId
from flask import Blueprint, g

from middleware.auth_middleware import jwt_required
from services.analytics_service import get_dashboard_data, get_performance_data, get_leaderboard
from utils.response import success


analytics_bp = Blueprint("analytics", __name__)


@analytics_bp.get("/dashboard")
@jwt_required
def dashboard_handler():
    data = get_dashboard_data(ObjectId(g.current_user["_id"]))
    return success(data)


@analytics_bp.get("/performance")
@jwt_required
def performance_handler():
    data = get_performance_data(ObjectId(g.current_user["_id"]))
    return success(data)


@analytics_bp.get("/leaderboard")
@jwt_required
def leaderboard_handler():
    return success(get_leaderboard())
