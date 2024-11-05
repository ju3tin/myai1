from diagrams import Cluster, Diagram, Edge
from diagrams.programming.framework import React
from diagrams.programming.language import TypeScript, Python 
from diagrams.onprem.compute import Server
from diagrams.generic.device import Mobile
from diagrams.onprem.client import Client

with Diagram("Pose Detection System Architecture", show=False, direction="LR"):
    # 客户端设备
    webcam = Mobile("Webcam")
    
    with Cluster("Frontend"):
        # React 组件
        with Cluster("React Components"):
            webcam_view = React("WebcamView")
            squat_detector = React("SquatDetector")
            facing_detector = React("FacingDetector")
            pose_view = React("PoseDetectionView")
        
        # TypeScript 工具库
        with Cluster("Pose Analysis Libraries"):
            norm_pose = TypeScript("normPose")
            sim_pose = TypeScript("simPose")
            rel_angle = TypeScript("relativeAngle")
            inv_feature = TypeScript("invariantFeature")
    
    # ML 处理
    with Cluster("ML Processing"):
        ml_engine = Python("TensorFlow.js")
        pose_detector = Server("Pose Detector")
        
        with Cluster("Analysis Features"):
            angle_calc = Server("Angle Calculation")
            sim_detect = Server("Similarity Detection")
            pose_norm = Server("Pose Normalization")
            face_detect = Server("Facing Detection")
    
    # 数据流向
    webcam >> webcam_view >> ml_engine
    ml_engine >> pose_detector
    
    # 连接检测器到各个组件
    pose_detector >> squat_detector
    pose_detector >> facing_detector
    pose_detector >> pose_view
    
    # 分析功能连接到工具库
    angle_calc >> Edge(color="blue") >> rel_angle
    sim_detect >> Edge(color="blue") >> sim_pose
    pose_norm >> Edge(color="blue") >> norm_pose
    face_detect >> Edge(color="blue") >> inv_feature
    
    # 工具库反馈到组件
    rel_angle >> Edge(color="green") >> squat_detector
    sim_pose >> Edge(color="green") >> pose_view
    norm_pose >> Edge(color="green") >> facing_detector
    inv_feature >> Edge(color="green") >> squat_detector