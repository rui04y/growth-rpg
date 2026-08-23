let player = {


    level: 1,
    hp: 100,
    maxHp: 100,

    exp: 0,
    nextExp: 100,

    atk: 10,
    def: 5,
    statusPoints: 0,

    statusBonus: {
    atk: 0,
    def: 0,
    hp: 0,
    mp: 0
    },

    mp: 30,
    maxMp: 30,

    gold: 100,


    unlockedStages: {
    grassland: true,
    cave: true,
    volcano: false,
    castle: false
    },
    bossDefeated: {
    grassland: false,
    cave: false,
    volcano: false,
    castle: false
    },





    // ====================
    // 🏋️ 訓練回数
    // ====================

    trainingCount: {
        
        atk: 0,
        def: 0,
        hp: 0,
        mp: 0
    },
    trainingLastRecovery: Date.now(),
    trainingCount: 0,
    maxTrainingCount: 30,

    itemUseCount: 0,
    maxItemUseCount: 3,

    // ====================
    // 🎒 アイテム
    // ====================

    items: {
        potion: 0,
        manaPotion: 0
    },


    // ====================
    // 🛡️ 装備
    // ====================

    equipment: {
        weapon: "なし",
        armor: "なし"
    },
    

    // ====================
    // 🎒 インベントリ
    // ====================

    materials: {},
    inventory: [],


    // ====================
    // ✨ スキル
    // ====================

    skills: {

        strong: {
            learned: true,
            level: 1,
            useCount: 0
        },

        fireball: {
            learned: true,
            level: 1,
            useCount: 0
        },

        thunder: {
            learned: false,
            level: 1,
            useCount: 0
        },

        ultimate: {
            learned: false,
            level: 1,
            useCount: 0
        }

    },
    effects: []
};

let currentDungeon = null;


const equipmentData = [
{
    name:"木の剣",
    type:"weapon",
    attack:5,
    defense:0
},
{
    name:"鉄の剣",
    type:"weapon",
    attack:12,
    defense:0
},
{
    name: "鋼の剣",
    type: "weapon",
    attack: 25,
    defense: 0
},

{
    name: "ミスリルソード",
    type: "weapon",
    attack: 45,
    defense: 0
},

{
    name: "ドラゴンソード",
    type: "weapon",
    attack: 70,
    defense: 0
},

{
    name: "伝説の剣",
    type: "weapon",
    attack: 110,
    defense: 0
},
{
    name:"革の盾",
    type:"armor",
    attack:0,
    defense:8
},
{
    name: "鉄の盾",
    type: "armor",
    attack: 0,
    defense: 15
},
{
    name: "鋼の盾",
    type: "armor",
    attack: 0,
    defense: 25
},

{
    name: "ミスリルシールド",
    type: "armor",
    attack: 0,
    defense: 45
},

{
    name: "ドラゴンシールド",
    type: "armor",
    attack: 0,
    defense: 70
},

{
    name: "伝説の盾",
    type: "armor",
    attack: 0,
    defense: 110
},


{
    name: "森王の剣",
    type: "weapon",
    attack: 20,
    effect: "skillPowerUp",
    effectText: "🌲 強撃ダメージ +10%"
},

{
    name: "岩王の剣",
    type: "weapon",
    attack: 35,
    effect: "skillPowerUp15",
    effectText: "🪨 強撃ダメージ +15%"
},

{
    name: "炎帝の剣",
    type: "weapon",
    attack: 50,
    effect: "fireballPowerUp",
    effectText: "🔥 ファイアボールダメージ +20%"
},
{
    name: "魔王の剣",
    type: "weapon",
    attack: 80,
    effect: "allSkillPowerUp",
    effectText: "👿 全スキルダメージ +15%"
},



];

let currentEquipment = null;

let equipmentAttackBonus = 0;
let equipmentDefenseBonus = 0;

let enemy = null;
let inBattle = false;
let defending = false;

function updateScreen() {

    document.getElementById("level").textContent = player.level;
    document.getElementById("hp").textContent = player.hp;
    document.getElementById("maxHp").textContent = player.maxHp;
    document.getElementById("exp").textContent = player.exp;
    document.getElementById("nextExp").textContent = player.nextExp;

    // 攻撃力・防御力
    document.getElementById("atk").textContent = player.atk;
    document.getElementById("def").textContent = player.def;

    // 所持金
    document.getElementById("gold").textContent = player.gold;

    // MP
    document.getElementById("mp").textContent = player.mp;
    document.getElementById("maxMp").textContent = player.maxMp;

    // 武器・防具
    document.getElementById("weapon").textContent =
        player.equipment.weapon;

    document.getElementById("armor").textContent =
        player.equipment.armor;


    // HPバー
    const hpPercent = (player.hp / player.maxHp) * 100;
    document.getElementById("hpBar").style.width =
        hpPercent + "%";


    // EXPバー
    const expPercent = (player.exp / player.nextExp) * 100;
    document.getElementById("expBar").style.width =
        expPercent + "%";


    // MPバー
    const mpPercent = (player.mp / player.maxMp) * 100;
    document.getElementById("mpBar").style.width =
        mpPercent + "%";

}
function log(text) {
    const logElement = document.getElementById("log");

    logElement.innerHTML += text + "<br>";

    // ログを一番下まで自動スクロール
    logElement.scrollTop = logElement.scrollHeight;
}

function train(type) {

    // 古いセーブデータへの対応
    if(player.totalTrainingCount === undefined){
        player.totalTrainingCount = 0;
    }

    if(player.maxTrainingCount === undefined){
        player.maxTrainingCount = 10;
    }

    // 訓練回数の上限チェック
    if(player.totalTrainingCount >= player.maxTrainingCount){

        log("🏋️ 訓練回数を使い切りました！");
        return;

    }

    // 戦闘中チェック
    if(inBattle){
        log("⚔️ 戦闘中は訓練できません！");
        return;
    }

    // 訓練回数データが古い形式なら作り直す
    if(
        !player.trainingCount ||
        typeof player.trainingCount !== "object"
    ){
        player.trainingCount = {
            atk: 0,
            def: 0,
            hp: 0,
            mp: 0
        };
    }

    // この種類の訓練回数がなければ0
    if(player.trainingCount[type] === undefined){
        player.trainingCount[type] = 0;
    }

    // この分野の訓練回数
    player.trainingCount[type]++;

    // 訓練回数に応じて効率低下
    let efficiency = Math.max(
        0.5,
        1 - (player.trainingCount[type] - 1) * 0.1
    );
    // ====================
    // ⚔️ 攻撃訓練
    // ====================

    if(type === "atk"){

        let baseGain = Math.floor(Math.random() * 2) + 1;

        let gain = Math.max(
            1,
            Math.floor(baseGain * efficiency)
        );

        player.atk += gain;

        log(
            `⚔️ 攻撃訓練！ ATK +${gain} ` +
            `(効率 ${Math.floor(efficiency * 100)}%)`
        );
    }


    // ====================
    // 🛡️ 防御訓練
    // ====================

    else if(type === "def"){

        let baseGain = Math.floor(Math.random() * 2) + 1;

        let gain = Math.max(
            1,
            Math.floor(baseGain * efficiency)
        );

        player.def += gain;

        log(
            `🛡️ 防御訓練！ DEF +${gain} ` +
            `(効率 ${Math.floor(efficiency * 100)}%)`
        );
    }


    // ====================
    // ❤️ 体力訓練
    // ====================

    else if(type === "hp"){

        let baseGain = Math.floor(Math.random() * 6) + 5;

        let gain = Math.max(
            1,
            Math.floor(baseGain * efficiency)
        );

        player.maxHp += gain;
        player.hp += gain;

        log(
            `❤️ 体力訓練！ 最大HP +${gain} ` +
            `(効率 ${Math.floor(efficiency * 100)}%)`
        );
    }


    // ====================
    // ✨ 魔力訓練
    // ====================

    else if(type === "mp"){

        let baseGain = Math.floor(Math.random() * 3) + 1;

        let gain = Math.max(
            1,
            Math.floor(baseGain * efficiency)
        );

        player.maxMp += gain;
        player.mp += gain;

        log(
            `✨ 魔力訓練！ 最大MP +${gain} ` +
            `(効率 ${Math.floor(efficiency * 100)}%)`
        );
    }
      // 全体の訓練回数を増やす
    player.totalTrainingCount++;

    updateScreen();
    autoSave();

}


function recoverTrainingEfficiency() {

    const now = Date.now();

    const elapsed = now - player.trainingLastRecovery;

    // 1時間 = 3600000ミリ秒
    const hours = Math.floor(elapsed / 3600000);

    if(hours <= 0){
        return;
    }

    // 1時間につき訓練回数を1回分減らす
    player.trainingCount.atk = Math.max(
        0,
        player.trainingCount.atk - hours
    );

    player.trainingCount.def = Math.max(
        0,
        player.trainingCount.def - hours
    );

    player.trainingCount.hp = Math.max(
        0,
        player.trainingCount.hp - hours
    );

    player.trainingCount.mp = Math.max(
        0,
        player.trainingCount.mp - hours
    );

    // 回復した時間を記録
    player.trainingLastRecovery += hours * 3600000;
}


function openTrainingMenu(){

    if(inBattle){
        log("⚔️ 戦闘中は訓練できません！");
        return;
    }

    document.getElementById("trainingMenu").style.display = "block";
    autoSave();
}


function closeTrainingMenu(){

    document.getElementById("trainingMenu").style.display = "none";
}





function levelUp() {

    player.level++;

    // 通常のステータス上昇
    player.maxHp += 10;
    player.hp = player.maxHp;

    player.atk += 2;
    player.def += 2;

    player.nextExp += 50;

    player.mp = player.maxMp;

    // ⭐ ステータスポイント獲得
    player.statusPoints += 3;

    log(`🎉 レベルアップ！ Lv.${player.level}になった！`);
    log(`⭐ ステータスポイントを3獲得！`);

    checkSkillLearn();
}


function checkSkillLearn(){

    if(player.level >= 3 && !player.skills.thunder.learned){

        player.skills.thunder.learned = true;

        log("⚡ 新しいスキル「サンダー」を習得した！");
    }

    if(player.level >= 5 && !player.skills.ultimate.learned){

        player.skills.ultimate.learned = true;

        log("💥 新しいスキル「大技」を習得した！");
    }
}

function adventure(dungeonType = "grassland") {

    player.itemUseCount = 0;
    if (inBattle) {
        log("すでに戦闘中！");
        return;
    }

    currentDungeon = dungeonType;



    const enemies = {

        // 🌳 草原
        grassland: [
            {name:"スライム", hp:50, maxHp:50, atk:8, exp:20, gold:15, drop:"slimeGel",dropRate:0.5},
            {name:"グレムリン", hp:50, maxHp:50, atk:10, exp:20, gold:15, drop:"gremlinClaw",dropRate:0.4},
            {name:"ゴブリン", hp:80, maxHp:80, atk:12, exp:35, gold:15, drop:"goblinFang",dropRate:0.5},
            {name:"オオカミ", hp:100, maxHp:100, atk:15, exp:50, gold:25, drop:"wolfFur",dropRate:0.6}
        ],

        // 🕳️ 洞窟
        cave: [
            {name:"ゾンビ", hp:150, maxHp:150, atk:10, exp:20, gold:15,drop:"zombieBone",dropRate:0.5},
            {name:"ゴブリン", hp:100, maxHp:100, atk:15, exp:40, gold:35, drop:"goblinFang",dropRate:0.5},
            {name:"オーク", hp:180, maxHp:180, atk:22, exp:80, gold:35,drop:"orcHorn",dropRate:0.45},
            {name:"リザードマン", hp:220, maxHp:220, atk:27, exp:110, gold:50,drop:"lizardScale",dropRate:0.4}
        ],

        // 🌋 火山
        volcano: [
            {name:"サラマンダー", hp:450, maxHp:450, atk:60, exp:250, gold:100,drop:"salamanderFlame",dropRate:0.4},
            {name:"オーク", hp:250, maxHp:250, atk:30, exp:100, gold:45,drop:"orcHorn",dropRate:0.5},
            {name:"炎の魔物", hp:350, maxHp:350, atk:38, exp:150, gold:65,drop:"fireCrystal",dropRate:0.45},
            {name:"ドラゴン", hp:500, maxHp:500, atk:50, exp:300, gold:125,drop:"dragonFang",dropRate:0.35}
        ],

        // 🏰 魔王城
        castle: [
            {name:"リッチ", hp:700, maxHp:700, atk:50, exp:50, gold:80,drop:"lichSoul",dropRate:0.35},
            {name:"リザードマン", hp:400, maxHp:400, atk:45, exp:180, gold:75,drop:"lizardScale",dropRate:0.45},
            {name:"デーモン", hp:600, maxHp:600, atk:55, exp:250, gold:110,drop:"demonHorn",dropRate:0.4},
            {name:"魔王軍騎士", hp:800, maxHp:800, atk:65, exp:350, gold:150,drop:"knightMedal",dropRate:0.3}
        ]
    };


    // =========================
    // 中ボス
    // =========================

    const miniBosses = {

        grassland:
            {name:"🐺 巨大オオカミ", hp:300, maxHp:300, atk:30, exp:150, gold:120, miniBoss:true,
        drop:"giantWolfFang",
        dropRate:1},

        cave:
            {name:"🪨 岩石巨人", hp:600, maxHp:600, atk:45, exp:300, gold:250, miniBoss:true,
        drop:"giantCore",
        dropRate:1},

        volcano:
            {name:"🔥 炎竜", hp:2000, maxHp:2000, atk:200, exp:600, gold:500, miniBoss:true,
        drop:"fireDragonHeart",
        dropRate:1},

        castle:
            {name:"⚔️ 魔将", hp:15000, maxHp:15000, atk:600, exp:1000, gold:800, miniBoss:true,
        drop:"demonGeneralCore",
        dropRate:1
    }
    };


    // =========================
    // ボス
    // =========================

    const bosses = {

        grassland:
            {name:"👑 森の王", hp:600, maxHp:600, atk:50, exp:500, gold:500, boss:true},

        cave:
            {name:"👹 洞窟の主", hp:1200, maxHp:1200, atk:70, exp:1000, gold:1000, boss:true},

        volcano:
            {name:"🐉 火山の王", hp:5000, maxHp:5000, atk:310, exp:2000, gold:2000, boss:true},

        castle:
            {name:"👿 魔王", hp:60000, maxHp:60000, atk:900, exp:5000, gold:5000, boss:true}
    };



    const rare = { 
        grassland:
            {name:"なんか珍しいやつ", hp:400, maxHp:400, atk:1, exp:1500, gold:500, boss:true},

        cave:
            {name:"なんか珍しいやつ", hp:1000, maxHp:1000, atk:1, exp:2000, gold:1000, boss:true},

        volcano:
            {name:"なんか珍しいやつ", hp:4500, maxHp:4500, atk:1, exp:4000, gold:2000, boss:true},

        castle:
            {name:"なんか珍しいやつ", hp:50000, maxHp:50000, atk:1, exp:7000, gold:5000, boss:true}
    };


    











    const enemyList = enemies[dungeonType];

    const random = Math.random();

    // =========================
    // 敵を決定
    // =========================

    if(random < 0.03){

        // 3% → ボス
        enemy = {...bosses[dungeonType]};

        log(`👑 BOSS！ ${enemy.name} が現れた！`);

    }
    else if(random < 0.12){

        // 12% → 中ボス
        enemy = {...miniBosses[dungeonType]};

        log(`⚠️ 強敵！ ${enemy.name} が現れた！`);

    }
    else if(random < 0.00001){

        // 0.001% → レアモン
        enemy = {...rare[dungeonType]};

        log(`⚠️ レア！ ${enemy.name} が現れた！`);

    }
    else{

        // 85% → 通常敵
        enemy = {
            ...enemyList[
                Math.floor(Math.random() * enemyList.length)
            ]
        };

        log(enemy.name + " が現れた！");
    }

    
    inBattle = true;
    player.itemUseCount = 0;
    document.getElementById("battle").style.display = "block";

    document.getElementById("enemyName").textContent = enemy.name;
    document.getElementById("enemyHp").textContent = enemy.hp;
    document.getElementById("enemyMaxHp").textContent = enemy.maxHp;
    document.getElementById("enemyHpBar").style.width = "100%";
}
const materialData = {
    slimeGel: "🟢 スライムジェル",
    gremlinClaw: "🦴 グレムリンの爪",
    goblinFang: "🦷 ゴブリンの牙",
    wolfFur: "🐺 オオカミの毛皮",

    zombieBone: "🦴 ゾンビの骨",
    orcHorn: "🦏 オークの角",
    lizardScale: "🐲 リザードマンの鱗",

    salamanderFlame: "🔥 サラマンダーの炎",
    fireCrystal: "🔴 炎の魔石",
    dragonFang: "🐉 ドラゴンの牙",

    lichSoul: "👻 リッチの魂",
    demonHorn: "👿 デーモンの角",
    knightMedal: "⚔️ 魔王軍騎士の勲章",

    giantWolfFang: "🐺 巨大オオカミの牙",
    giantCore: "🪨 岩石巨人の核",
    fireDragonHeart: "🔥 炎竜の心臓",
    demonGeneralCore: "⚔️ 魔将の核"
};


function enemyDrop(enemy){

    // ドロップ設定がない敵
    if(!enemy.drop){
        return;
    }

    // ドロップ確率判定
    if(Math.random() >= enemy.dropRate){
        return;
    }

    // 古いセーブデータ対策
    if(!player.materials){
        player.materials = {};
    }

    // 初めて入手した素材なら0個から開始
    if(player.materials[enemy.drop] === undefined){
        player.materials[enemy.drop] = 0;
    }

    // 素材を1個追加
    player.materials[enemy.drop]++;

    log(`🎁 ${materialData[enemy.drop]}を入手した！`);
}

function bossReward() {

    if(player.bossDefeated[currentDungeon]){
        return;
    }

    player.bossDefeated[currentDungeon] = true;

    let rewardGold = 0;
    let rewardItem = null;

    if(currentDungeon === "grassland"){

        rewardGold = 500;

        rewardItem = "森王の剣";

    }

    else if(currentDungeon === "cave"){

        rewardGold = 1000;

        rewardItem = "岩石の盾";

    }

    else if(currentDungeon === "volcano"){

        rewardGold = 2000;

        rewardItem = "炎帝の剣";

    }

    else if(currentDungeon === "castle"){

        rewardGold = 5000;

        rewardItem = "魔王の鎧";

    }


    // GOLD獲得
    player.gold += rewardGold;


    // 装備をインベントリに追加
    if(rewardItem){

        player.inventory.push(rewardItem);
    }


    log(
        `🎉 初回ボス撃破報酬！\n` +
        `💰 GOLD +${rewardGold}G\n` +
        `⚔️ ${rewardItem} を獲得！`
    );


    autoSave();
}



function unlockNextStage() {

    if(currentDungeon === "grassland" ||
       currentDungeon === "cave") {

        if(!player.unlockedStages.volcano) {

            player.unlockedStages.volcano = true;

            log("🎉 🌋 火山が解放された！");
        }
    }

    else if(currentDungeon === "volcano") {

        if(!player.unlockedStages.castle) {

            player.unlockedStages.castle = true;

            log("🎉 🏰 魔王城が解放された！");
        }
    }

    else if(currentDungeon === "castle") {

        log("👑 魔王城を完全攻略した！");
    }

    autoSave();
}
function heal() {

    if(inBattle){
        log("⚔️ 戦闘中は回復できません！");
        return;
    }


    player.hp = player.maxHp;
    log("❤️ 全回復した！");
    updateScreen();
}

function saveGame() {
    localStorage.setItem("growthRPG", JSON.stringify(player));
    log("💾 セーブしました！");
}
function autoSave() {
    localStorage.setItem("growthRPG", JSON.stringify(player));
}

function loadGame() {

    let save = localStorage.getItem("growthRPG");

    if (save) {

        player = JSON.parse(save);

        // ====================
        // 古いセーブデータ対策
        // ====================

        if(!player.trainingCount){

            player.trainingCount = {
                atk: 0,
                def: 0,
                hp: 0,
                mp: 0
            };
        }

        if(!player.trainingLastRecovery){

            player.trainingLastRecovery = Date.now();
        }


        // ====================
        // 訓練効率を時間経過で回復
        // ====================

        recoverTrainingEfficiency();


        updateScreen();

        log("📂 ロードしました！");

    } else {

        log("セーブデータがありません。");
    }
}
function attack(){

    if(!inBattle) return;

    let damage = Math.floor(Math.random()*player.atk)+1;

    enemy.hp -= damage;

    if(enemy.hp < 0){
        enemy.hp = 0;
    }

    document.getElementById("enemyHp").textContent = enemy.hp;

    let percent = enemy.hp / enemy.maxHp * 100;
    document.getElementById("enemyHpBar").style.width = percent + "%";

    if(enemy.hp <= 0){
    
        player.exp += enemy.exp;
        player.gold += enemy.gold;
        enemyDrop(enemy);
        while(player.exp >= player.nextExp){
            player.exp -= player.nextExp;
            levelUp();
        }

        updateScreen();

        log(enemy.name + " を倒した！");
        if(enemy.boss){
        bossReward();
        unlockNextStage(currentDungeon);
        }
        inBattle = false;

        document.getElementById("battle").style.display = "none";

        return;
    }

    enemyAttack();
}

function enemyAttack(){

    let damage = Math.max(1, enemy.atk - Math.floor(player.def / 2));

    if(defending){
        damage = Math.floor(damage / 2);
        defending = false;
    }

    player.hp -= damage;

    if (player.hp <= 0) {
        player.hp = 0;
        updateScreen();

        alert("💀 GAME OVER");

        // 所持金10%減少
        player.gold = Math.floor(player.gold * 0.9);

        // HP全回復
        player.hp = player.maxHp;

        // MP全回復
        player.mp = player.maxMp;

        // 戦闘終了
        inBattle = false;
        enemy = null;

        document.getElementById("battle").style.display = "none";

        log("💀 力尽きた…。町に戻り、HPが全回復した。（所持金10%減少）");

        updateScreen();
        return;
    }

    updateScreen();

    log(enemy.name + " の攻撃！ " + damage + "ダメージ！");


    // 🔥 やけどダメージ
    if(enemy && enemy.burn > 0){

        const burnDamageAmount = 20;

        enemy.hp -= burnDamageAmount;

        if(enemy.hp < 0){
            enemy.hp = 0;
        }

        enemy.burn--;

        document.getElementById("enemyHp").textContent = enemy.hp;

        const percent = enemy.hp / enemy.maxHp * 100;

        document.getElementById("enemyHpBar").style.width =
            percent + "%";

        log(`🔥 やけど！ ${burnDamageAmount}ダメージ！`);


        // 🔥 やけどで敵を倒した場合
        if(enemy.hp <= 0){

            player.exp += enemy.exp;
            player.gold += enemy.gold;

            while(player.exp >= player.nextExp){
                player.exp -= player.nextExp;
                levelUp();
            }

            updateScreen();

            log(enemy.name + " はやけどで倒れた！");
            if(enemy.boss){
                bossReward();
            unlockNextStage(currentDungeon);
            }
            inBattle = false;
            enemy = null;

            document.getElementById("battle").style.display = "none";

            return;
        }


        // 🔥 やけど終了
        if(enemy.burn <= 0){
            log("🔥 " + enemy.name + " のやけどが治った！");
        }




    }
    if(enemy && enemy.paralysis > 0){

    log(`⚡ ${enemy.name} は麻痺して動けない！`);

    enemy.paralysis--;

    return;
    }

}
function runAway(){

    if(!inBattle) return;

    inBattle = false;

    document.getElementById("battle").style.display = "none";

    log("逃げ出した！");
}
updateScreen();
function defend(){

    if(!inBattle) return;

    defending = true;

    log("🛡️ 防御した！");

    enemyAttack();
}
function skill(){

    console.log("skill発動", player.effects);

    if(!inBattle) return;

    if(player.mp < 5){
        log("MPが足りない！");
        return;
    }

    player.mp -= 5;

    let damage = player.atk * 2 + Math.floor(Math.random()*10);

    // 森王の剣の特殊効果
    if(player.effects && player.effects.includes("skillPowerUp")){
    damage = Math.floor(damage * 1.1);
    log("🌲 森王の剣の効果発動！");
    }

    enemy.hp -= damage;

    if(enemy.hp < 0){
        enemy.hp = 0;
    }

    document.getElementById("enemyHp").textContent = enemy.hp;

    let percent = enemy.hp / enemy.maxHp * 100;
    document.getElementById("enemyHpBar").style.width = percent + "%";

    updateScreen();

    log("✨ 強撃！ " + damage + "ダメージ！");

    if(enemy.hp <= 0){
     
        player.exp += enemy.exp;
        player.gold += enemy.gold;
        enemyDrop(enemy);
        while(player.exp >= player.nextExp){
            player.exp -= player.nextExp;
            levelUp();
        }

        updateScreen();

        log(enemy.name + " を倒した！");
        if(enemy.boss){
            bossReward();
        unlockNextStage(currentDungeon);
        }
        inBattle = false;
        enemy = null;

        document.getElementById("battle").style.display = "none";

        return;
    }

    enemyAttack();
}
function shop(){


    if(inBattle){
        log("⚔️ 戦闘中はショップを利用できません！");
        return;
    }



    let choice = prompt(

        `
        🏪 ショップ

1. アイテム
2. 武器
3. 防具

番号を入力してください。
`
);

switch(choice){

    case "1":
        itemShop();
        break;


    case "2":
        weaponShop();
        break;


    case "3":
        armorShop();
        break;


    default:
        log("ショップを閉じた");
}
function shop(){

    let choice = prompt(
`
🏪 ショップ

1. アイテム
2. 武器
3. 防具

番号を入力してください。
`
);


    switch(choice){

        case "1":
            itemShop();
            break;


        case "2":
            weaponShop();
            break;


        case "3":
            armorShop();
            break;


        default:
            log("ショップを閉じた");

    }

    updateScreen();

}



function itemShop(){

    let choice = prompt(
`
🧪 アイテムショップ

1. ポーション　30G
2. マナポーション　50G

番号を入力してください。
`
);


    switch(choice){

        case "1":

            if(player.gold >= 30){

                player.gold -= 30;
                player.items.potion++;

                log("🧪 ポーションを買った！");

            }else{

                log("お金が足りません！");

            }

            break;



        case "2":

            if(player.gold >= 50){

                player.gold -= 50;
                player.items.manaPotion++;

                log("🔵 マナポーションを買った！");

            }else{

                log("お金が足りません！");

            }

            break;



        default:

            log("アイテムショップを閉じた");

    }


    updateScreen();

}




function weaponShop(){

    let choice = prompt(
`
⚔️ 武器ショップ

1. 木の剣　100G
2. 鉄の剣　300G
3. 鋼の剣　700G
4. ミスリルソード　1500G
5. ドラゴンソード　30000G
6. 伝説の剣　99999G


番号を入力してください。
`
);


    switch(choice){


        case "1":

            buyWeapon("木の剣",100,5);

            break;



        case "2":

            buyWeapon("鉄の剣",300,12);

            break;

        
        
        case "3":

            buyWeapon("鋼の剣", 700, 25);

            break;



         case "4":

            buyWeapon("ミスリルソード", 1500, 45);

            break;


        
         case "5":

            buyWeapon("ドラゴンソード", 30000, 70);

            break;



         case "6":

            buyWeapon("伝説の剣", 99999, 110);

            break;




        default:

            log("武器ショップを閉じた");

    }

}




function buyWeapon(name,price,attack){

    if(player.gold < price){

        log("お金が足りません！");
        return;

    }


    if(player.inventory.includes(name)){

        log("すでに持っています！");
        return;

    }


    player.gold -= price;


    player.inventory.push(name);


    // 前の武器補正を削除
    player.atk -= player.equipment.weaponAtk || 0;


    // 装備
    player.equipment.weapon = name;

    player.equipment.weaponAtk = attack;


    player.atk += attack;


    log("⚔️ " + name + "を手に入れて装備した！");


    updateEquipmentStatus();

    showEquipment();

    updateScreen();

}




function armorShop(){

    let choice = prompt(
`
🛡️ 防具ショップ

1. 革の盾　200G
2. 鉄の盾　400G
3. 鋼の盾　800G
4. ミスリルシールド　1800G
5. ドラゴンシールド　35000G
6. 伝説の盾　99999G
番号を入力してください。
`
);


    switch(choice){

        case "1":

            buyArmor("革の盾",200,8);

            break;



        case "2":

             buyArmor("鉄の盾", 400, 15);

            break;



        case "3":

            buyArmor("鋼の盾", 800, 25);

            break;


        case "4":

            buyArmor("ミスリルシールド", 1800, 45);
            
            break;



        case "5":
            
            buyArmor("ドラゴンシールド", 35000, 60);
            
            break;



        case "6":
            
            buyArmor("伝説の盾", 99999, 80);
            
            break;


        default:

            log("防具ショップを閉じた");

    }

}



function buyArmor(name,price,defense){


    if(player.gold < price){

        log("お金が足りません！");
        return;

    }


    if(player.inventory.includes(name)){

        log("すでに持っています！");
        return;

    }


    player.gold -= price;


    player.inventory.push(name);


    // 前の防具補正を削除
    player.def -= player.equipment.armorDef || 0;


    // 装備
    player.equipment.armor = name;

    player.equipment.armorDef = defense;


    player.def += defense;


    log("🛡️ " + name + "を手に入れて装備した！");


    updateEquipmentStatus();

    showEquipment();

    updateScreen();

}






function closeEquipment(){

    document.getElementById("equipmentScreen").style.display = "none";

}



}
function openEquipment(){

    if(inBattle){
        log("⚔️ 戦闘中は装備を変更できません！");
        return;
    }

    console.log("装備画面開いた");

    document.getElementById("equipmentScreen").style.display = "block";

    showEquipment();
}


function closeEquipment(){

    document.getElementById("equipmentScreen").style.display = "none";

}


console.log("openEquipment:", typeof openEquipment);



function equipItem(index){

    let item = equipmentData[index];


    // 武器の場合
    if(item.type === "weapon"){

        // 前の武器補正を外す
        player.atk -= player.equipment.weaponAtk || 0;

        // 新しい武器を装備
        player.equipment.weapon = item.name;
        player.equipment.weaponAtk = item.attack;

        // 新しい攻撃力を加える
        player.atk += item.attack;

    }


    // 防具の場合
    if(item.type === "armor"){

        // 前の防具補正を外す
        player.def -= player.equipment.armorDef || 0;

        // 新しい防具を装備
        player.equipment.armor = item.name;
        player.equipment.armorDef = item.defense;

        // 新しい防御力を加える
        player.def += item.defense;

    }


   // ⭐ 装備の特殊効果を更新
    player.effects = [];

    if(item.effect){
    player.effects.push(item.effect);
    
    }

    log("⚔️ " + item.name + "を装備した！");


    // 全画面を更新
    updateEquipmentStatus();
    showEquipment();
    updateScreen();

}


function showEquipment(){

    console.log("showEquipment動いた");

    const list = document.getElementById("equipmentList");

    list.innerHTML = "";

    const container = document.createElement("div");
    container.className = "equipmentColumns";


    // ⚔️ 武器
    const weaponColumn = document.createElement("div");

    weaponColumn.innerHTML = "<h3>⚔️ 武器</h3>";

    equipmentData.forEach((item, index) => {

        if(item.type !== "weapon"){
            return;
        }

        if(!player.inventory.includes(item.name)){
            return;
        }

        const div = document.createElement("div");

        div.className = "equipmentItem";

        let equipped = "";

        if(player.equipment.weapon === item.name){
            equipped = "（装備中）";
        }

        div.innerHTML = `
        ${item.name} ${equipped}<br>
         攻撃力 +${item.attack}
        ${item.effectText ? `<br>${item.effectText}` : ""}
        `;

        div.onclick = function(){
            equipItem(index);
        };

        weaponColumn.appendChild(div);

    });


    // 🛡️ 防具
    const armorColumn = document.createElement("div");

    armorColumn.innerHTML = "<h3>🛡️ 防具</h3>";

    equipmentData.forEach((item, index) => {

        if(item.type !== "armor"){
            return;
        }

        if(!player.inventory.includes(item.name)){
            return;
        }

        const div = document.createElement("div");

        div.className = "equipmentItem";

        let equipped = "";

        if(player.equipment.armor === item.name){
            equipped = "（装備中）";
        }

        div.innerHTML = `
        ${item.name} ${equipped}<br>
        防御力 +${item.defense}
        ${item.effectText ? `<br>${item.effectText}` : ""}
        `;
        div.onclick = function(){
            equipItem(index);
        };

        armorColumn.appendChild(div);

    });


    container.appendChild(weaponColumn);
    container.appendChild(armorColumn);

    list.appendChild(container);

}


function updateEquipmentStatus(){

    const weaponText = document.getElementById("weaponText");
    const armorText = document.getElementById("armorText");

    console.log("武器表示:", player.equipment.weapon);
    console.log("防具表示:", player.equipment.armor);

    weaponText.textContent =
        "武器：" + player.equipment.weapon;

    armorText.textContent =
        "防具：" + player.equipment.armor;
}

function removeEquipment(){

    // 武器を外す
    player.atk -= player.equipment.weaponAtk || 0;

    // 防具を外す
    player.def -= player.equipment.armorDef || 0;


    // 装備をなしにする
    player.equipment.weapon = "なし";
    player.equipment.armor = "なし";


    // 装備補正をリセット
    player.equipment.weaponAtk = 0;
    player.equipment.armorDef = 0;

    player.effects = [];
    log("装備を外した！");


    // 表示更新
    updateEquipmentStatus();
    showEquipment();
    updateScreen();

}
function openSkillMenu(){

    if(!inBattle){
        return;
    }

    const list = document.getElementById("skillList");

    list.innerHTML = "";


    // ⚡ 強撃
    if(player.skills.strong.learned){

        const button = document.createElement("button");

        button.textContent =
            `⚡ 強撃 Lv.${player.skills.strong.level}（MP 5）`;

        button.onclick = function(){
            useSkill(1);
        };

        list.appendChild(button);
    }


    // 🔥 火球
    if(player.skills.fireball.learned){

        const button = document.createElement("button");

        button.textContent =
            `🔥 火球 Lv.${player.skills.fireball.level}（MP 10）`;

        button.onclick = function(){
            useSkill(2);
        };

        list.appendChild(button);
    }


    // 💥 大技
    if(player.skills.ultimate.learned){

        const button = document.createElement("button");

        button.textContent =
            `💥 大技 Lv.${player.skills.ultimate.level}（MP 20）`;

        button.onclick = function(){
            useSkill(3);
        };

        list.appendChild(button);
    }


    // ⚡ サンダー
    if(player.skills.thunder.learned){

        const button = document.createElement("button");

        button.textContent =
            `⚡ サンダー Lv.${player.skills.thunder.level}（MP 15）`;

        button.onclick = function(){
            useSkill(4);
        };

        list.appendChild(button);
    }


    document.getElementById("skillMenu").style.display = "block";
}


function closeSkillMenu(){

    document.getElementById("skillMenu").style.display = "none";

}

function burnDamage(){

    if(!enemy || enemy.burn <= 0){
        return;
    }

    const damage = 20;

    enemy.hp -= damage;

    if(enemy.hp < 0){
        enemy.hp = 0;
    }

    enemy.burn--;

    document.getElementById("enemyHp").textContent = enemy.hp;

    const percent = enemy.hp / enemy.maxHp * 100;

    document.getElementById("enemyHpBar").style.width =
        percent + "%";

    log(`🔥 やけど！ ${damage}ダメージ！`);

    if(enemy.burn <= 0){
        log("🔥 やけどが治った！");
    }
}
function useSkill(type){

    let skillName;

    if(type === 1){
        skillName = "strong";
    }
    else if(type === 2){
        skillName = "fireball";
    }
    else if(type === 3){
        skillName = "ultimate";
    }
    else if(type === 4){
        skillName = "thunder";
    }

    if(!inBattle){
        return;
    }

    closeSkillMenu();


    // ====================
    // ⚡ 強撃
    // ====================

    if(type === 1){

        const mpCost = 5;

        if(player.mp < mpCost){
            log("MPが足りない！");
            return;
        }

        player.mp -= mpCost;

        let damage =
            player.atk * (2 + (player.skills.strong.level - 1) * 0.5) +
            Math.floor(Math.random() * 10);
           

           if(player.effects && player.effects.includes("skillPowerUp")){
            damage = damage * 1.1;
            log("🌲 森王の剣の効果発動！");
            }

            if(player.effects && player.effects.includes("skillPowerUp15")){
            damage = damage * 1.15;
            log("🪨 岩王の剣の効果発動！");
            if(player.effects && player.effects.includes("allSkillPowerUp")){
            damage = damage * 1.15;
            log("👿 魔王の剣の効果発動！");
            }
        }
        
        enemy.hp -= Math.floor(damage);

        if(enemy.hp < 0){
            enemy.hp = 0;
        }

        log(`⚡ 強撃 Lv.${player.skills.strong.level}！ ${Math.floor(damage)}ダメージ！`);
    }


    // ====================
    // 🔥 火球
    // ====================

    else if(type === 2){

        const mpCost = 10;

        if(player.mp < mpCost){
            log("MPが足りない！");
            return;
        }

        player.mp -= mpCost;

        let damage =
        player.atk * (1.5 + (player.skills.fireball.level - 1) * 0.5) +
        Math.floor(Math.random() * 10);


        // 🔥 炎帝の剣の特殊効果
        if(player.effects && player.effects.includes("fireballPowerUp")){
        damage = damage * 1.2;
        log("🔥 炎帝の剣の効果発動！");
        }
        if(player.effects && player.effects.includes("allSkillPowerUp")){
        damage = damage * 1.15;
        log("👿 魔王の剣の効果発動！");
        }
        

        enemy.hp -= Math.floor(damage);

        if(enemy.hp < 0){
            enemy.hp = 0;
        }

        log(`🔥 火球 Lv.${player.skills.fireball.level}！ ${Math.floor(damage)}ダメージ！`);

        // 30%でやけど
        if(enemy.hp > 0 && Math.random() < 0.3){

            enemy.burn = 3;

            log(`🔥 ${enemy.name} はやけどした！`);
        }
    }


    // ====================
    // 💥 大技
    // ====================

    else if(type === 3){

        const mpCost = 20;

        if(player.mp < mpCost){
            log("MPが足りない！");
            return;
        }

        player.mp -= mpCost;

        let damage =
        player.atk * (5 + (player.skills.ultimate.level - 1) * 0.5) +
        Math.floor(Math.random() * 20);


        // 👿 魔王の剣の特殊効果
        if(player.effects && player.effects.includes("allSkillPowerUp")){
        damage = damage * 1.15;
        log("👿 魔王の剣の効果発動！");
        }   

        enemy.hp -= Math.floor(damage);

        if(enemy.hp < 0){
            enemy.hp = 0;
        }

        log(`💥 大技 Lv.${player.skills.ultimate.level}！ ${Math.floor(damage)}ダメージ！`);
    }


    // ====================
    // ⚡ サンダー
    // ====================

    else if(type === 4){

        const mpCost = 15;

        if(player.mp < mpCost){
            log("MPが足りない！");
            return;
        }

        player.mp -= mpCost;

        let damage =
        player.atk * (2.5 + (player.skills.thunder.level - 1) * 0.5) +
        Math.floor(Math.random() * 15);

        // 👿 魔王の剣の特殊効果
        if(player.effects && player.effects.includes("allSkillPowerUp")){
        damage = damage * 1.15;
        log("👿 魔王の剣の効果発動！");
        }
        enemy.hp -= Math.floor(damage);

        if(enemy.hp < 0){
            enemy.hp = 0;
        }

        log(`⚡ サンダー Lv.${player.skills.thunder.level}！ ${Math.floor(damage)}ダメージ！`);

        // 30%で麻痺
        if(enemy.hp > 0 && Math.random() < 0.3){

            enemy.paralysis = 1;

            log(`⚡ ${enemy.name} は麻痺した！`);
        }
    }


    // ====================
    // スキル使用回数
    // ====================

    player.skills[skillName].useCount++;

    checkSkillLevelUp(skillName);


    // ====================
    // 敵HP更新
    // ====================

    document.getElementById("enemyHp").textContent = enemy.hp;

    const percent =
        enemy.hp / enemy.maxHp * 100;

    document.getElementById("enemyHpBar").style.width =
        percent + "%";

    updateScreen();


    // ====================
    // 敵を倒した場合
    // ====================

    if(enemy.hp <= 0){
    
        player.exp += enemy.exp;
        player.gold += enemy.gold;
        enemyDrop(enemy);
        while(player.exp >= player.nextExp){
            player.exp -= player.nextExp;
            levelUp();
        }

        updateScreen();

        log(enemy.name + " を倒した！");
        if(enemy.boss){
            bossReward();
        unlockNextStage(currentDungeon);
        }
        inBattle = false;
        enemy = null;

        document.getElementById("battle").style.display = "none";

        return;
    }


    // 敵のターン
    enemyAttack();
}
function checkSkillLevelUp(skillName){

    const skill = player.skills[skillName];

    const requiredUses = skill.level * 10;

    if(skill.useCount >= requiredUses){

        skill.useCount = 0;
        skill.level++;

        let skillDisplayName;

        if(skillName === "strong"){
            skillDisplayName = "⚡ 強撃";
        }
        else if(skillName === "fireball"){
            skillDisplayName = "🔥 火球";
        }
        else if(skillName === "thunder"){
            skillDisplayName = "⚡ サンダー";
        }
        else if(skillName === "ultimate"){
            skillDisplayName = "💥 大技";
        }

        log(`✨ ${skillDisplayName} がLv.${skill.level}になった！`);
    }
}
function openDungeon(){

function openDungeon(){

    if(inBattle){
        log("⚔️ 戦闘中は冒険先を変更できません！");
        return;
    }

    document.getElementById("dungeonScreen").style.display = "block";
}


    if(inBattle){
        log("すでに戦闘中！");
        return;
    }

    document.getElementById("dungeonScreen").style.display = "block";
    autoSave();
}


function closeDungeon(){

    document.getElementById("dungeonScreen").style.display = "none";
}

function startDungeon(type){


    clearLog();

    // ↓今ある処理
    const dungeonName = {
        grassland: "🌳 草原",
        cave: "🕳️ 洞窟",
        volcano: "🌋 火山",
        castle: "🏰 魔王城"
    };

    // ====================
    // 🔒 ステージ解放チェック
    // ====================

    if(!player.unlockedStages[type]){

        log(`${dungeonName[type]}はまだ解放されていません！`);

        return;
    }

    closeDungeon();

    log(`${dungeonName[type]}へ向かった！`);

    adventure(type);
}
function autoSave() {
    localStorage.setItem("growthRPG", JSON.stringify(player));
}

setInterval(function() {
    autoSave();
}, 30000);

function unlockNextStage() {

    if (currentDungeon === "grassland" ||
        currentDungeon === "cave") {

        if (!player.unlockedStages.volcano) {

            player.unlockedStages.volcano = true;

            log("🎉 🌋 火山が解放された！");
        }
    }

    else if (currentDungeon === "volcano") {

        if (!player.unlockedStages.castle) {

            player.unlockedStages.castle = true;

            log("🎉 🏰 魔王城が解放された！");
        }
    }

    else if (currentDungeon === "castle") {

        log("👑 魔王城を完全攻略した！");
    }

    autoSave();
}


window.useItem = function(){

    // 戦闘中の使用回数制限
    if(inBattle && player.itemUseCount >= player.maxItemUseCount){

        log("🎒 この戦闘ではこれ以上アイテムを使えません！");
        return;
    }

    let choice = prompt(
`
🎒 アイテム

使用回数：${player.itemUseCount} / ${player.maxItemUseCount}

1. ポーション ×${player.items.potion}

2. マナポーション ×${player.items.manaPotion}`
    );

    switch(choice){

        case "1":

            if(player.items.potion > 0){

                player.items.potion--;

                player.hp = Math.min(player.maxHp, player.hp + 50);

                // 戦闘中なら使用回数を増やす
                if(inBattle){
                    player.itemUseCount++;
                }

                log("❤️ ポーションを使った！");

            }else{
                log("ポーションがありません！");
            }

            break;


        case "2":

            if(player.items.manaPotion > 0){

                player.items.manaPotion--;

                player.mp = Math.min(player.maxMp, player.mp + 20);

                // 戦闘中なら使用回数を増やす
                if(inBattle){
                    player.itemUseCount++;
                }

                log("🔵 マナポーションを使った！");

            }else{
                log("マナポーションがありません！");
            }

            break;
    }

    updateScreen();

    document.getElementById("weapon").textContent =
        player.equipment.weapon;

    document.getElementById("armor").textContent =
        player.equipment.armor;
};

function openStatusMenu(){

    if(inBattle){
        log("⚔️ 戦闘中はステータスを開けません！");
        return;
    }

    document.getElementById("statusMenu").style.display = "block";

    updateStatusMenu();
}


function closeStatusMenu(){

    document.getElementById("statusMenu").style.display = "none";

}


function updateStatusMenu(){

    document.getElementById("statusPoints").textContent =
        player.statusPoints;

    document.getElementById("statusAtk").textContent =
        player.atk;

    document.getElementById("statusDef").textContent =
        player.def;

    document.getElementById("statusMaxHp").textContent =
        player.maxHp;

    document.getElementById("statusMaxMp").textContent =
        player.maxMp;

}


function addStatusPoint(type){

    if(player.statusPoints <= 0){

        log("⭐ ステータスポイントがありません！");
        return;

    }


    if(!player.statusBonus){
        player.statusBonus = {
            atk: 0,
            def: 0,
            hp: 0,
            mp: 0
        };
    }


    if(type === "atk"){

        player.atk += 1;
        player.statusBonus.atk += 1;

    }
    else if(type === "def"){

        player.def += 1;
        player.statusBonus.def += 1;

    }
    else if(type === "hp"){

        player.maxHp += 5;
        player.hp += 5;
        player.statusBonus.hp += 5;

    }
    else if(type === "mp"){

        player.maxMp += 3;
        player.mp += 3;
        player.statusBonus.mp += 3;

    }


    player.statusPoints--;

    updateStatusMenu();
    updateScreen();

}
function resetStatusPoints(){

    if(player.statusPoints === 0 &&
       (!player.statusBonus ||
        (
            player.statusBonus.atk === 0 &&
            player.statusBonus.def === 0 &&
            player.statusBonus.hp === 0 &&
            player.statusBonus.mp === 0
        ))){

        log("⭐ リセットするポイントがありません！");
        return;

    }


    if(player.gold < 100){

        log("💰 リセットには100G必要です！");
        return;

    }


    if(!confirm("⭐ ステータスポイントをリセットしますか？\n100Gかかります。")){
        return;
    }


    if(!player.statusBonus){
        player.statusBonus = {
            atk: 0,
            def: 0,
            hp: 0,
            mp: 0
        };
    }


    // 振り分けた分だけ元に戻す
    player.atk -= player.statusBonus.atk;
    player.def -= player.statusBonus.def;

    player.maxHp -= player.statusBonus.hp;
    player.maxMp -= player.statusBonus.mp;


    // 最大値を超えないように調整
    player.hp = Math.min(player.hp, player.maxHp);
    player.mp = Math.min(player.mp, player.maxMp);


    // 振り分けたポイントを返す
    player.statusPoints +=
        player.statusBonus.atk +
        player.statusBonus.def +
        player.statusBonus.hp / 5 +
        player.statusBonus.mp / 3;


    // 記録をリセット
    player.statusBonus = {
        atk: 0,
        def: 0,
        hp: 0,
        mp: 0
    };


    player.gold -= 100;


    log("🔄 ステータスポイントをリセットした！");

    updateStatusMenu();
    updateScreen();

}
function clearLog(){

    document.getElementById("log").textContent = "";

}
function openInventory(){

    if(inBattle){
        log("⚔️ 戦闘中はインベントリを開けません！");
        return;
    }

    document.getElementById("inventoryScreen").style.display = "block";

    updateInventory();
}


function closeInventory(){

    document.getElementById("inventoryScreen").style.display = "none";
}


function updateInventory(){

    // ====================
    // 🧪 消費アイテム
    // ====================

    const itemList = document.getElementById("itemList");

    itemList.innerHTML = `
        ❤️ ポーション ×${player.items.potion}<br>
        🔵 マナポーション ×${player.items.manaPotion}
    `;


    // ====================
    // 🛠️ 素材
    // ====================

    const materialList =
        document.getElementById("materialList");

    materialList.innerHTML = "";

    if(!player.materials){
        materialList.textContent = "素材を持っていません";
    }
    else{

        let hasMaterial = false;

        for(let material in player.materials){

            if(player.materials[material] > 0){

                materialList.innerHTML +=
                    `${materialData[material] || material} ×${player.materials[material]}<br>`;

                hasMaterial = true;
            }
        }

        if(!hasMaterial){
            materialList.textContent = "素材を持っていません";
        }
    }


    // ====================
    // ⚔️ 装備
    // ====================

    const equipmentList =
        document.getElementById("inventoryEquipmentList");

    equipmentList.innerHTML = "";

    if(!player.inventory || player.inventory.length === 0){

        equipmentList.textContent = "装備を持っていません";

    }
    else{

        player.inventory.forEach(item => {

            equipmentList.innerHTML +=
                `⚔️ ${item}<br>`;

        });
    }
}
function openMenu(){

    if(inBattle){
        log("⚔️ 戦闘中はメニューを開けません！");
        return;
    }

    document.getElementById("menuScreen").style.display = "block";
}


function closeMenu(){

    document.getElementById("menuScreen").style.display = "none";
}























function testGold(){

    player.gold += 100000;

    updateScreen();

    log("💰 100000Gを追加しました！");
}

function testForestBoss() {

    if(inBattle){
        log("すでに戦闘中！");
        return;
    }

    currentDungeon = "grassland";

    enemy = {
        name: "👑 森の王",
        hp: 600,
        maxHp: 600,
        atk: 50,
        exp: 500,
        gold: 500,
        boss: true
    };

    inBattle = true;

    document.getElementById("battle").style.display = "block";

    document.getElementById("enemyName").textContent = enemy.name;
    document.getElementById("enemyHp").textContent = enemy.hp;
    document.getElementById("enemyMaxHp").textContent = enemy.maxHp;
    document.getElementById("enemyHpBar").style.width = "100%";

    log("🧪 テスト：森の王が現れた！");
}
function testAllEquipment(){

    equipmentData.forEach(item => {

        if(!player.inventory.includes(item.name)){
            player.inventory.push(item.name);
        }

    });

    showEquipment();
    updateScreen();

    log("🛠️ テスト用に全装備を取得しました！");
}
