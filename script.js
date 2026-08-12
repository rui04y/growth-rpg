let player = {
    level: 1,
    hp: 100,
    maxHp: 100,
    exp: 0,
    nextExp: 100,
    atk: 10,
    def: 5,
    gold: 100,
    mp: 20,
maxMp: 20,





items: {
    potion: 0,
    manaPotion: 0,
},
equipment: {
    weapon: "なし",
    armor: "なし"
},

inventory: [],
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
}

};


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

function train() {
    let gain = Math.floor(Math.random() * 16) + 15;
    player.exp += gain;
    log(`🏋️ 訓練した！ EXP +${gain}`);

    while (player.exp >= player.nextExp) {
        player.exp -= player.nextExp;
        levelUp();
    }

    updateScreen();
}

function levelUp() {

    player.level++;

    player.maxHp += 20;
    player.hp = player.maxHp;

    player.atk += 3;
    player.def += 2;

    player.nextExp += 50;

    player.mp = player.maxMp;

    log(`🎉 レベルアップ！ Lv.${player.level}になった！`);

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

function adventure() {

    if (inBattle) {
        log("すでに戦闘中！");
        return;
    }
    document.getElementById("log").innerHTML = "";

    const enemies = [
        // ===== 序盤 =====
        {name:"スライム", hp:50, maxHp:50, atk:8, exp:20, gold:15},
        {name:"ゴブリン", hp:80, maxHp:80, atk:12, exp:35, gold:30},
        {name:"オオカミ", hp:120, maxHp:120, atk:16, exp:50, gold:45},

        // ===== 中盤 =====
        {name:"オーク", hp:180, maxHp:180, atk:22, exp:75, gold:70},
        {name:"リザードマン", hp:240, maxHp:240, atk:28, exp:100, gold:90},
        {name:"ドラゴン", hp:400, maxHp:400, atk:40, exp:200, gold:150},

        // ===== 後半 =====
        {name:"ゴーレム", hp:500, maxHp:500, atk:45, exp:250, gold:180},
        {name:"デーモン", hp:650, maxHp:650, atk:55, exp:300, gold:220},
        {name:"ワイバーン", hp:800, maxHp:800, atk:65, exp:350, gold:250},
        {name:"フェンリル", hp:1000, maxHp:1000, atk:75, exp:400, gold:300},

        // ===== 最終級 =====
        {name:"魔王", hp:1500, maxHp:1500, atk:90, exp:700, gold:500}
    ];


    // レベルに応じて出現する敵を変更

    let availableEnemies;

if (player.level <= 2) {

    availableEnemies = enemies.slice(0, 2);

} else if (player.level <= 4) {

    availableEnemies = enemies.slice(0, 4);

} else if (player.level <= 7) {

    availableEnemies = enemies.slice(0, 6);

} else if (player.level <= 10) {

    availableEnemies = enemies.slice(0, 8);

} else if (player.level <= 15) {

    availableEnemies = enemies.slice(0, 10);

} else {

    availableEnemies = enemies;
}


    // 敵をランダム選択
    enemy = {
    ...availableEnemies[
        Math.floor(Math.random() * availableEnemies.length)
    ],
    burn: 0,
    paralysis: 0
};


    inBattle = true;


    // 戦闘画面を表示
    document.getElementById("battle").style.display = "block";


    // 敵情報を表示
    document.getElementById("enemyName").textContent = enemy.name;

    document.getElementById("enemyHp").textContent = enemy.hp;

    document.getElementById("enemyMaxHp").textContent = enemy.maxHp;

    document.getElementById("enemyHpBar").style.width = "100%";


    log(enemy.name + " が現れた！");
}
function heal() {
    player.hp = player.maxHp;
    log("❤️ 全回復した！");
    updateScreen();
}

function saveGame() {
    localStorage.setItem("growthRPG", JSON.stringify(player));
    log("💾 セーブしました！");
}

function loadGame() {
    let save = localStorage.getItem("growthRPG");

    if (save) {
        player = JSON.parse(save);
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

        while(player.exp >= player.nextExp){
            player.exp -= player.nextExp;
            levelUp();
        }

        updateScreen();

        log(enemy.name + " を倒した！");

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

    if(!inBattle) return;

    if(player.mp < 5){
        log("MPが足りない！");
        return;
    }

    player.mp -= 5;

    let damage = player.atk * 2 + Math.floor(Math.random()*10);

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

        while(player.exp >= player.nextExp){
            player.exp -= player.nextExp;
            levelUp();
        }

        updateScreen();

        log(enemy.name + " を倒した！");

        inBattle = false;
        enemy = null;

        document.getElementById("battle").style.display = "none";

        return;
    }

    enemyAttack();
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
5. ドラゴンソード　3000G
6. 伝説の剣　6000G


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

            buyWeapon("ドラゴンソード", 3000, 70);

            break;



         case "6":

            buyWeapon("伝説の剣", 6000, 110);

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
5. ドラゴンシールド　3500G
6. 伝説の盾　7000G
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
            
            buyArmor("ドラゴンシールド", 3500, 70);
            
            break;



        case "6":
            
            buyArmor("伝説の盾", 7000, 110);
            
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



function useItem(){

    let choice = prompt(
`
🎒 アイテム

1. ポーション ×${player.items.potion}

2. マナポーション ×${player.items.manaPotion}`
);

    switch(choice){

        case "1":

            if(player.items.potion > 0){

                player.items.potion--;

                player.hp = Math.min(player.maxHp, player.hp + 50);

                log("❤️ ポーションを使った！");
            }else{
                log("ポーションがありません！");
            }

            break;

        case "2":

            if(player.items.manaPotion > 0){

                player.items.manaPotion--;

                player.mp = Math.min(player.maxMp, player.mp + 20);

                log("🔵 マナポーションを使った！");
            }else{
                log("マナポーションがありません！");
            }

            break;
    }

    updateScreen();
    document.getElementById("weapon").textContent = player.equipment.weapon;
    document.getElementById("armor").textContent = player.equipment.armor;
}




function closeEquipment(){

    document.getElementById("equipmentScreen").style.display = "none";

}



function removeEquipment(){

    // 武器を外す
    player.atk -= player.equipment.weaponAtk || 0;

    // 防具を外す
    player.def -= player.equipment.armorDef || 0;


    player.equipment.weapon = "なし";
    player.equipment.armor = "なし";


    player.equipment.weaponAtk = 0;
    player.equipment.armorDef = 0;


    log("装備を外した！");


    updateEquipmentStatus();

    showEquipment();

}}
function openEquipment(){

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
}function useSkill(type){

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

        const damage =
            player.atk * (2 + (player.skills.strong.level - 1) * 0.5) +
            Math.floor(Math.random() * 10);

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

        const damage =
            player.atk * (3 + (player.skills.fireball.level - 1) * 0.5) +
            Math.floor(Math.random() * 10);

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

        const damage =
            player.atk * (5 + (player.skills.ultimate.level - 1) * 0.5) +
            Math.floor(Math.random() * 20);

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

        const damage =
            player.atk * (2.5 + (player.skills.thunder.level - 1) * 0.5) +
            Math.floor(Math.random() * 15);

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

        while(player.exp >= player.nextExp){
            player.exp -= player.nextExp;
            levelUp();
        }

        updateScreen();

        log(enemy.name + " を倒した！");

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



















function testGold(){
    player.gold += 1000;
    updateScreen();
    log("💰 テスト用に1000G追加！");
}


