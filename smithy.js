// ==============================
// 🔨 鍛冶屋
// ==============================

function openSmithy(){

    document.getElementById("menuScreen").style.display = "none";

    document.getElementById("smithyScreen").style.display = "block";

    selectedCraftMaterials = [];

    selectedCraftType = null;

    selectedCraftBase = null;

    document.getElementById(
        "craftTypeText"
    ).textContent = "選択中：なし";

    document.getElementById(
        "craftBaseText"
    ).textContent = "選択中：なし";

    document.getElementById(
        "craftName"
    ).value = "";

    updateCraftBaseList();

    updateCraftMaterials();

    updateCraftPreview();

}


function closeSmithy(){

    // 鍛冶屋を閉じる
    document.getElementById("smithyScreen").style.display = "none";

    // メニューに戻る
    document.getElementById("menuScreen").style.display = "block";

}

// ==============================
// 🔨 鍛冶屋：素材選択
// ==============================

let selectedCraftMaterials = [];

// ==============================
// 🔨 鍛冶屋：ベース装備
// ==============================

let selectedCraftType = null;
let selectedCraftBase = null;


// ベース装備データ
const craftBaseData = {

    weapon: [
        {
            name: "木の剣",
            attack: 5,
            defense: 0
        },
        {
            name: "鉄の剣",
            attack: 12,
            defense: 0
        },
        {
            name: "鋼の剣",
            attack: 25,
            defense: 0
        },
        {
            name: "ミスリルソード",
            attack: 45,
            defense: 0
        },
        {
            name: "ドラゴンソード",
            attack: 70,
            defense: 0
        },
        {
            name: "伝説の剣",
            attack: 110,
            defense: 0
        }
    ],

    armor: [
        {
            name: "革の盾",
            attack: 0,
            defense: 8
        },
        {
            name: "鉄の盾",
            attack: 0,
            defense: 15
        },
        {
            name: "鋼の盾",
            attack: 0,
            defense: 25
        },
        {
            name: "ミスリルシールド",
            attack: 0,
            defense: 45
        },
        {
            name: "ドラゴンシールド",
            attack: 0,
            defense: 70
        },
        {
            name: "伝説の盾",
            attack: 0,
            defense: 110
        }
    ]

};


// 装備タイプ選択
function selectCraftType(type){

    selectedCraftType = type;
    selectedCraftBase = null;

    const text =
        document.getElementById("craftTypeText");

    if(type === "weapon"){
        text.textContent = "選択中：⚔️ 武器";
    }

    if(type === "armor"){
        text.textContent = "選択中：🛡️ 防具";
    }

    updateCraftBaseList();
    updateCraftPreview();

}

//ベース素材一覧
function updateCraftBaseList(){

    const list = document.getElementById("craftBaseList");

    list.innerHTML = "";

    if(!selectedCraftType){
        list.textContent = "装備タイプを選択してください。";
        return;
    }

    if(!player.inventory || player.inventory.length === 0){
        list.textContent = "このタイプの装備を持っていません。";
        return;
    }

    // 所持している装備だけをベース候補にする
    const ownedBases = craftBaseData[selectedCraftType].filter(base =>
        player.inventory.includes(base.name)
    );

    if(ownedBases.length === 0){
        list.textContent = "このタイプの装備を持っていません。";
        return;
    }

    ownedBases.forEach(base => {

        const div = document.createElement("div");

        div.className = "craftBaseItem";

        if(
            selectedCraftBase &&
            selectedCraftBase.name === base.name
        ){
            div.classList.add("selected");
        }

        div.innerHTML = `
            <strong>${base.name}</strong><br>
            ${base.attack > 0 ? `⚔️ ATK +${base.attack}` : ""}
            ${base.defense > 0 ? `🛡️ DEF +${base.defense}` : ""}
        `;

        div.onclick = function(){
            selectedCraftBase = base;

            document.getElementById("craftBaseText").textContent =
                "選択中：" + base.name;

            updateCraftBaseList();
            updateCraftPreview();
        };

        list.appendChild(div);

    });
}


function updateCraftMaterials(){

    const list = document.getElementById("craftMaterialList");

    if(!list) return;

    list.innerHTML = "";


    for(const materialId in player.materials){

        const amount = player.materials[materialId];

        if(amount <= 0) continue;

        const materialName = materialData[materialId];

        if(!materialName) continue;


        const div = document.createElement("div");

        div.className = "craftMaterialCard";

        div.innerHTML = `
            <div class="craftMaterialName">
                ${materialName}
            </div>

            <div class="craftMaterialAmount">
                所持数：${amount}
            </div>
        `;


        div.onclick = function(){

            selectCraftMaterial(materialId);

        };


        list.appendChild(div);

    }


    updateSelectedCraftMaterials();

}
// ==============================
// 🔨 素材を選択
// ==============================

function selectCraftMaterial(materialId){

    // 最大3個
    if(selectedCraftMaterials.length >= 3){

        // すでに選択されている素材なら解除できる
        const index = selectedCraftMaterials.indexOf(materialId);

        if(index !== -1){

            selectedCraftMaterials.splice(index, 1);

            updateSelectedCraftMaterials();
            updateCraftPreview();

        }

        return;
    }


    // 追加
    selectedCraftMaterials.push(materialId);


    updateSelectedCraftMaterials();
    updateCraftPreview();

}
// ==============================
// 🔨 選択中素材の表示
// ==============================

function updateSelectedCraftMaterials(){

    const container =
        document.getElementById("selectedCraftMaterials");

    if(!container) return;


    if(selectedCraftMaterials.length === 0){

        container.innerHTML =
            "まだ素材が選択されていません。";

        return;

    }


    container.innerHTML = "";


    selectedCraftMaterials.forEach((materialId, index) => {

        const div = document.createElement("div");

        div.className = "selectedCraftMaterial";

        div.innerHTML = `
            ${index + 1}. ${materialData[materialId]}
            <span>✕</span>
        `;


        div.onclick = function(){

            selectedCraftMaterials.splice(index, 1);

            updateSelectedCraftMaterials();
            updateCraftMaterials();
            updateCraftPreview();

        };


        container.appendChild(div);

    });

}

// ==============================
// 🔨 鍛冶屋：素材効果データ
// ==============================

const craftMaterialData = {

    slimeGel: {
        effects: { maxHp: 0.05 },
        traits: ["生命"]
    },

    gremlinClaw: {
        effects: { atk: 0.03 },
        traits: ["狂暴"]
    },

    goblinFang: {
        effects: { criticalRate: 0.02 },
        traits: ["狩猟"]
    },

    wolfFur: {
        effects: { criticalDamage: 0.05 },
        traits: ["野性"]
    },

    zombieBone: {
        effects: { def: 0.05 },
        traits: ["不死"]
    },

    orcHorn: {
        effects: { atk: 0.05 },
        traits: ["剛力"]
    },

    lizardScale: {
        effects: { def: 0.07 },
        traits: ["硬質"]
    },

    salamanderFlame: {
        effects: { fireDamage: 0.08 },
        traits: ["炎"]
    },

    fireCrystal: {
        effects: { skillDamage: 0.06 },
        traits: ["魔力"]
    },

    dragonFang: {
        effects: { atk: 0.08 },
        traits: ["竜"]
    },

    lichSoul: {
        effects: {
            maxMp: 0.05,
            skillDamage: 0.03
        },
        traits: ["霊魂"]
    },

    demonHorn: {
        effects: {
            atk: 0.08,
            damageTaken: 0.03
        },
        traits: ["悪魔"]
    },

    knightMedal: {
        effects: {
            atk: 0.04,
            def: 0.04
        },
        traits: ["騎士"]
    },

    giantWolfFang: {
        effects: { criticalRate: 0.04 },
        traits: ["野性"]
    },

    giantCore: {
        effects: { def: 0.12 },
        traits: ["大地"]
    },

    fireDragonHeart: {
        effects: {
            maxHp: 0.07,
            fireDamage: 0.08
        },
        traits: ["炎", "竜"]
    },

    demonGeneralCore: {
        effects: {
            atk: 0.06,
            def: 0.06,
            skillDamage: 0.03
        },
        traits: ["悪魔", "魔力"]
    }

};

// ==============================
// 🔨 同じ効果の重複補正
// 1個目 100%
// 2個目 70%
// 3個目 40%
// ==============================

function getDiminishingMultiplier(count){

    if(count === 1) return 1.0;
    if(count === 2) return 0.7;
    if(count === 3) return 0.4;

    return 0;
}
// ==============================
// 🔨 素材効果を計算
// ==============================

function calculateCraftEffects(materialIds){

    const result = {};

    for(const materialId of materialIds){

        const material = craftMaterialData[materialId];

        if(!material) continue;


        for(const effectName in material.effects){

            if(!result[effectName]){
                result[effectName] = [];
            }

            result[effectName].push(
                material.effects[effectName]
            );

        }

    }


    // 重複補正を適用
    for(const effectName in result){

        const values = result[effectName];

        let total = 0;

        values.forEach((value, index) => {

            const multiplier =
                getDiminishingMultiplier(index + 1);

            total += value * multiplier;

        });

        result[effectName] = total;

    }


    return result;

}
// ==============================
// 🔨 鍛冶屋：鍛造結果プレビュー
// ==============================

function updateCraftPreview(){

    const preview =
        document.getElementById("craftPreview");

    if(!preview) return;

    if(selectedCraftMaterials.length === 0){

        preview.innerHTML = `
            <p>素材を選択してください。</p>
        `;

        return;
    }

    const effects =
        calculateCraftEffects(selectedCraftMaterials);

    const traits = [];

    selectedCraftMaterials.forEach(materialId => {

        const material =
            craftMaterialData[materialId];

        if(!material) return;

        material.traits.forEach(trait => {

            if(!traits.includes(trait)){
                traits.push(trait);
            }

        });

    });

    const sameTraitBonuses =
        calculateSameTraitBonuses(selectedCraftMaterials);

    const traitComboBonuses =
        calculateTraitComboBonuses(selectedCraftMaterials);

    let html = `
        <div class="craftResultPreview">

            <h4>🛠️ 基本効果</h4>
    `;

    const effectNames = {

        atk: "⚔️ ATK",
        def: "🛡️ DEF",
        maxHp: "❤️ 最大HP",
        maxMp: "🔵 最大MP",
        criticalRate: "🎯 クリティカル率",
        criticalDamage: "💥 クリティカルダメージ",
        skillDamage: "✨ スキルダメージ",
        fireDamage: "🔥 炎属性ダメージ",
        damageTaken: "🩸 被ダメージ"

    };

    let hasEffect = false;

    for(const effectName in effects){

        const value = effects[effectName];

        if(value === 0) continue;

        hasEffect = true;

        const displayName =
            effectNames[effectName] || effectName;

        const percent =
            Math.round(value * 1000) / 10;

        html += `
            <p>
                ${displayName} +${percent}%
            </p>
        `;
    }

    if(!hasEffect){

        html += `<p>基本効果なし</p>`;

    }

    // ==============================
    // 特性
    // ==============================

    html += `
        <h4>🔮 特性</h4>
    `;

    if(traits.length === 0){

        html += `<p>なし</p>`;

    }else{

        html += `<p>${traits.join("・")}</p>`;

    }

    // ==============================
    // 同じ特性のボーナス
    // ==============================

    html += `
        <h4>✨ 特性ボーナス</h4>
    `;

    if(sameTraitBonuses.length === 0){

        html += `<p>なし</p>`;

    }else{

        sameTraitBonuses.forEach(bonus => {

            html += `<p>${bonus}</p>`;

        });

    }

    // ==============================
    // 異なる特性のコンボ
    // ==============================

    html += `
        <h4>🔥 特性コンボ</h4>
    `;

    if(traitComboBonuses.length === 0){

        html += `<p>なし</p>`;

    }else{

        traitComboBonuses.forEach(combo => {

            html += `<p>${combo}</p>`;

        });

    }

    html += `
        </div>
    `;

    // 最後にまとめて表示
    preview.innerHTML = html;
}

// ==============================
// 🔨 同じ特性の組み合わせボーナス
// ==============================

function calculateSameTraitBonuses(materialIds){

    const traitCounts = {};

    // 特性の数を数える
    materialIds.forEach(materialId => {

        const material =
            craftMaterialData[materialId];

        if(!material) return;

        material.traits.forEach(trait => {

            if(!traitCounts[trait]){
                traitCounts[trait] = 0;
            }

            traitCounts[trait]++;

        });

    });

    const bonuses = [];

    // ==============================
    // 生命
    // ==============================

    if(traitCounts["生命"] >= 2){

        if(traitCounts["生命"] >= 3){

            bonuses.push("❤️ 最大HP＋10%");

        }else{

            bonuses.push("❤️ 最大HP＋5%");

        }

    }

    // ==============================
    // 剛力
    // ==============================

    if(traitCounts["剛力"] >= 2){

        if(traitCounts["剛力"] >= 3){

            bonuses.push("⚔️ ATK＋8%");

        }else{

            bonuses.push("⚔️ ATK＋4%");

        }

    }

    // ==============================
    // 竜
    // ==============================

    if(traitCounts["竜"] >= 2){

        if(traitCounts["竜"] >= 3){

            bonuses.push("🐉 ATK＋6%");

        }else{

            bonuses.push("🐉 ATK＋3%");

        }

    }

    // ==============================
    // 大地
    // ==============================

    if(traitCounts["大地"] >= 2){

        if(traitCounts["大地"] >= 3){

            bonuses.push("🛡️ DEF＋10%");

        }else{

            bonuses.push("🛡️ DEF＋5%");

        }

    }

    // ==============================
    // 野性
    // ==============================

    if(traitCounts["野性"] >= 2){

        if(traitCounts["野性"] >= 3){

            bonuses.push("💥 クリティカルダメージ＋12%");

        }else{

            bonuses.push("💥 クリティカルダメージ＋6%");

        }

    }

    // ==============================
    // 不死
    // ==============================

    if(traitCounts["不死"] >= 2){

        if(traitCounts["不死"] >= 3){

            bonuses.push("🛡️ 被ダメージ−8%");

        }else{

            bonuses.push("🛡️ 被ダメージ−4%");

        }

    }

    // ==============================
    // 魔力
    // ==============================

    if(traitCounts["魔力"] >= 2){

        if(traitCounts["魔力"] >= 3){

            bonuses.push("✨ スキルダメージ＋8%");

        }else{

            bonuses.push("✨ スキルダメージ＋4%");

        }

    }

    // ==============================
    // 悪魔
    // ==============================

    if(traitCounts["悪魔"] >= 2){

        if(traitCounts["悪魔"] >= 3){

            bonuses.push(
                "😈 ATK＋8% / 被ダメージ＋4%"
            );

        }else{

            bonuses.push(
                "😈 ATK＋4% / 被ダメージ＋2%"
            );

        }

    }

    return bonuses;
}
// ==============================
// 🔨 異なる特性の組み合わせボーナス
// ==============================

function calculateTraitComboBonuses(materialIds){

    const traits = [];

    materialIds.forEach(materialId => {

        const material =
            craftMaterialData[materialId];

        if(!material) return;

        material.traits.forEach(trait => {

            if(!traits.includes(trait)){
                traits.push(trait);
            }

        });

    });

    const bonuses = [];

    // ==============================
    // 生命＋不死
    // ==============================

    if(
        traits.includes("生命") &&
        traits.includes("不死")
    ){

        bonuses.push(
            "🛡️ 不滅：致死ダメージを受けてもHP1で1回耐える"
        );

    }

    // ==============================
    // 狂暴＋剛力
    // ==============================

    if(
        traits.includes("狂暴") &&
        traits.includes("剛力")
    ){

        bonuses.push(
            "⚔️ 狂戦士：HP50%以下で通常攻撃＋20%"
        );

    }

    // ==============================
    // 狩猟＋野性
    // ==============================

    if(
        traits.includes("狩猟") &&
        traits.includes("野性")
    ){

        bonuses.push(
            "🎯 捕食者：クリティカル発生時、次の攻撃のクリ率＋10%"
        );

    }

    // ==============================
    // 炎＋竜
    // ==============================

    if(
        traits.includes("炎") &&
        traits.includes("竜")
    ){

        bonuses.push(
            "🔥 竜炎：攻撃時10%で追加の炎ダメージ"
        );

    }

    // ==============================
    // 魔力＋霊魂
    // ==============================

    if(
        traits.includes("魔力") &&
        traits.includes("霊魂")
    ){

        bonuses.push(
            "👻 魂喰らい：スキルで与えたダメージの5%をMP回復"
        );

    }

    // ==============================
    // 硬質＋大地
    // ==============================

    if(
        traits.includes("硬質") &&
        traits.includes("大地")
    ){

        bonuses.push(
            "🪨 不動：1ターンに受けるダメージを最大HPの25%までに制限"
        );

    }

    // ==============================
    // 悪魔＋霊魂
    // ==============================

    if(
        traits.includes("悪魔") &&
        traits.includes("霊魂")
    ){

        bonuses.push(
            "😈 禁忌：スキルダメージ＋15%、スキル使用時に最大HPの5%消費"
        );

    }

    // ==============================
    // 騎士＋生命
    // ==============================

    if(
        traits.includes("騎士") &&
        traits.includes("生命")
    ){

        bonuses.push(
            "🛡️ 守護者：HP50%以下でDEF＋20%"
        );

    }

    // ==============================
    // 炎＋竜＋狂暴
    // ==============================

    if(
        traits.includes("炎") &&
        traits.includes("竜") &&
        traits.includes("狂暴")
    ){

        bonuses.push(
            "🐉 竜王の怒り：HP50%以下で通常攻撃が炎属性＋20%、敵最大HPの5%炎ダメージ"
        );

    }

    return bonuses;
}

// ==============================
// 🔨 装備を鍛造
// ==============================

function craftEquipment(){

    // ==============================
    // 基本チェック
    // ==============================

    if(!selectedCraftType){

        alert("⚠️ 武器か防具を選択してください。");

        return;

    }


    if(!selectedCraftBase){

        alert("⚠️ ベース装備を選択してください。");

        return;

    }


    if(
        selectedCraftMaterials.length < 1 ||
        selectedCraftMaterials.length > 3
    ){

        alert("⚠️ 素材を1～3個選択してください。");

        return;

    }


    // ==============================
    // 装備名
    // ==============================

    const nameInput =
        document.getElementById("craftName");

    const name =
        nameInput.value.trim();


    if(!name){

        alert("⚠️ 装備名を入力してください。");

        return;

    }


    // ==============================
    // 素材所持数チェック
    // ==============================

    const materialCounts = {};


    selectedCraftMaterials.forEach(materialId => {

        if(!materialCounts[materialId]){

            materialCounts[materialId] = 0;

        }

        materialCounts[materialId]++;

    });


    for(const materialId in materialCounts){

        const required =
            materialCounts[materialId];

        const owned =
            player.materials[materialId] || 0;


        if(owned < required){

            alert(
                "⚠️ " +
                (materialData[materialId] || materialId) +
                "が足りません。"
            );

            return;

        }

    }


    // ==============================
    // 同名装備チェック
    // ==============================

    if(
        equipmentData.some(
            item => item.name === name
        )
    ){

        alert("⚠️ その名前の装備はすでに存在します。");

        return;

    }


    // ==============================
    // 素材効果計算
    // ==============================

    const effects =
        calculateCraftEffects(
            selectedCraftMaterials
        );


    const sameTraitBonuses =
        calculateSameTraitBonuses(
            selectedCraftMaterials
        );


    const traitComboBonuses =
        calculateTraitComboBonuses(
            selectedCraftMaterials
        );


    // ==============================
    // 装備データ作成
    // ==============================

    const craftedEquipment = {

        name: name,

        type: selectedCraftType,

        attack:
            selectedCraftBase.attack,

        defense:
            selectedCraftBase.defense,

        crafted: true,

        baseName:
            selectedCraftBase.name,

        materials:
            [...selectedCraftMaterials],

        craftEffects:
            effects,

        craftTraits: [],

        sameTraitBonuses:
            sameTraitBonuses,

        traitComboBonuses:
            traitComboBonuses

    };


    // ==============================
    // 特性を保存
    // ==============================

    selectedCraftMaterials.forEach(materialId => {

        const material =
            craftMaterialData[materialId];

        if(!material) return;


        material.traits.forEach(trait => {

            if(
                !craftedEquipment.craftTraits
                    .includes(trait)
            ){

                craftedEquipment.craftTraits.push(trait);

            }

        });

    });


    // ==============================
    // equipmentDataへ追加
    // ==============================

    equipmentData.push(
        craftedEquipment
    );


    // ==============================
    // インベントリへ追加
    // ==============================

    player.inventory.push(name);


    // ==============================
    // 素材を消費
    // ==============================

    for(const materialId in materialCounts){

        player.materials[materialId] -=
            materialCounts[materialId];


        if(
            player.materials[materialId] <= 0
        ){

            delete player.materials[materialId];

        }

    }


    // ==============================
    // 完了
    // ==============================

    log(
        "🔨 " +
        name +
        "を鍛造した！"
    );


    log(
        "⚔️ ベース：" +
        selectedCraftBase.name
    );


    log(
        "🛠️ 素材：" +
        selectedCraftMaterials
            .map(id => materialData[id])
            .join(" / ")
    );


    // ==============================
    // リセット
    // ==============================

    selectedCraftMaterials = [];

    selectedCraftBase = null;


    document.getElementById(
        "craftName"
    ).value = "";


    document.getElementById(
        "craftBaseText"
    ).textContent =
        "選択中：なし";


    updateCraftBaseList();

    updateCraftMaterials();

    updateCraftPreview();

    updateScreen();

    autoSave();

}
