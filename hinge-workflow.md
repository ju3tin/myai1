flowchart TB
    classDef phase fill:#e1f5fe,stroke:#01579b,stroke-width:2px,rx:10
    classDef process fill:#f3e5f5,stroke:#4a148c,stroke-width:2px
    classDef decision fill:#fff3e0,stroke:#e65100,stroke-width:2px,shape:diamond
    classDef data fill:#e8f5e9,stroke:#1b5e20,stroke-width:2px

    Start([项目启动]) --> Phase1

    subgraph Phase1[" 1️⃣ 需求调研"]
        direction TB
        A1[了解医生需求]:::process --> A2[分析现有产品]
        A2 --> A3[确定解决方案]
        A1 -.- NoteA1[如何帮助医生<br>服务更多患者]:::data
        A2 -.- NoteA2[现有产品<br>优缺点分析]:::data
    end

    subgraph Phase2[" 2️⃣ 流程分析"]
        direction TB
        B1[诊断流程梳理]:::process --> B2[治疗流程梳理]
        B2 --> B3[数据需求分析]
        B3 --> B4[数据安全方案]
        B1 -.- NoteB1[诊断环节<br>数据记录<br>评估方法]:::data
        B2 -.- NoteB2[治疗动作<br>练习记录<br>效果评估]:::data
    end

    subgraph Phase3[" 3️⃣ 标准制定"]
        direction TB
        C1[选定诊断姿势]:::process --> C2[选定练习姿势]
        C2 --> C3[制定诊断标准]
        C3 --> C4[制定练习标准]
        C1 -.- NoteC1[与医生共同<br>建立数据集]:::data
    end

    subgraph Phase4[" 4️⃣ Demo开发"]
        direction TB
        D1[用户端开发]:::process
        D2[医生端开发]:::process
        D3[数据库建设]:::process

        D1 -.- NoteD1[练习功能]:::data
        D2 -.- NoteD2[诊断设置<br>查看用户状态]:::data
    end

    subgraph Phase5[" 5️⃣ 演示验证"]
        direction TB
        E1[现场演示]:::process --> E2{医生反馈}:::decision
        E2 -->|需要修改| E3[优化调整] --> E1
        E2 -->|通过| E4[远程测试]
        E4 --> E5[最终确认]

        E1 -.- NoteE1[医生现场体验]:::data
        E4 -.- NoteE4[远程诊疗测试]:::data
    end

    Phase1 --> Phase2
    Phase2 --> Phase3
    Phase3 --> Phase4
    Phase4 --> Phase5
