function enemyAttack(){

    // ⚡ 行動不能
    if(enemy.stunned > 0){

    log("⚡ " + enemy.name + " は行動できない！");

    enemy.stunned--;

    return;
    }
    // ❄️ コキュートス
    let enemyAtk = enemy.atk;

    if(
    player.effects &&
    player.effects.includes("enemyAtkDown20") &&
    Math.random() < 0.2
    ){
    enemyAtk = Math.floor(enemy.atk * 0.8);
    log("❄️ コキュートス発動！ 敵ATK -20%");
    }

    let damage = Math.max(1, enemyAtk - Math.floor(getTotalDef() / 2));
    // 🏆 初撃無効
    if(
    player.equippedTitle === "初撃無効" &&
    !player.titleFirstDamageUsed
    ){
    player.titleFirstDamageUsed = true;

    log("🛡️ 初撃無効！ 最初に受けるダメージを無効化！");

    damage = 0;
    }

    if(defending){
    damage = Math.floor(damage / 2)
    defending = false;
    }

    // 🌑 シャドウ
    if(
    player.effects &&
    player.effects.includes("damageReduction")
    ){
    damage = Math.floor(damage * 0.95);
    log("🌑 シャドウの効果発動！ 被ダメージ5%軽減！");
    }

    // 🌫️ 紫煙
        if(
    player.effects &&
    player.effects.includes("damageReduction15")
    ){
    damage = Math.floor(damage * 0.85);
    log("🌫️ 紫煙の効果発動！ 被ダメージ15%軽減！");
    }

    

    // 🎹 リスト
        if(
    player.effects &&
    player.effects.includes("lowHpDamageReduction") &&
    player.hp <= player.maxHp * 0.5
    ){
    damage = Math.floor(damage * 0.75);
    log("🎹 リストの効果発動！ 被ダメージ25%軽減！");
    }

    // 🎵 ワーグナー
    const heavyDamageThreshold = player.maxHp * 0.2;

    if(
    player.effects &&
    player.effects.includes("heavyDamageReduction") &&
    damage > heavyDamageThreshold
    ){
    const originalDamage = damage;

    damage = Math.floor(damage * 0.8);

    log(
        "🎵 ワーグナーの効果発動！ " +
        originalDamage + " → " + damage + "ダメージ"
    );
    }   

    // 🔨 鍛造装備の被ダメージ
    const craftDamageTaken =
    getCraftEffect("damageTaken");

    if(craftDamageTaken > 0){

    const originalDamage = damage;

    damage = Math.max(
        1,
        Math.floor(damage * (1 + craftDamageTaken))
    );

    log(
        `🔨 鍛造装備の被ダメージ +${Math.round(craftDamageTaken * 100)}% ` +
        `${originalDamage} → ${damage}ダメージ`
    );
    }

    // 🗿 不動
    if(hasImmovableTraitCombo()){

    const maxDamage = Math.floor(
        getTotalMaxHp() * 0.25
    );

    if(damage > maxDamage){

        log(
            "🗿 不動発動！ " +
            damage +
            " → " +
            maxDamage +
            "ダメージに制限！"
        );

        damage = maxDamage;
    }
    }


    // 🔨 不滅／輪廻
            // 戦闘中に一度だけ、致死ダメージをHP1で耐える
    if(
    damage >= player.hp &&
    !player.immortalTraitUsed &&
    hasImmortalTraitCombo()
    ){

    player.immortalTraitUsed = true;
    player.hp = 1;

    log("♾️ 不滅／輪廻が発動！ HP1で耐えた！");

    }else{

    // 🏆 称号：ダメージを受けた
    player.titleNoDamage = false;

    player.hp -= damage;

    }

    // 💚 イクイスース
    if(
    player.effects &&
    player.effects.includes("emergencyHeal20") &&
    !player.emergencyHealUsed &&
    player.hp > 0 &&
    player.hp <= player.maxHp * 0.3
    ){
    const healAmount = Math.floor(player.maxHp * 0.2);

    player.hp = Math.min(
        player.maxHp,
        player.hp + healAmount
    );

    player.emergencyHealUsed = true;

    log(
        "💚 イクイスース発動！ HPが " +
        healAmount +
        " 回復！"
    );
    }

    // 💚 不滅の鎧
    if(
    player.effects &&
    player.effects.includes("turnHeal5")
        ){
    const healAmount = Math.floor(getTotalMaxHp() * 0.05);

    player.hp = Math.min(
        player.maxHp,
        player.hp + healAmount
    );

    log("💚 不滅の鎧：HPが " + healAmount + " 回復！");
    }


    // 🛡️ アイアンメイデン
    if(
    player.effects &&
    player.effects.includes("damageReflect")
    ){
    const reflectDamage = Math.floor(damage * 0.1);

    enemy.hp -= reflectDamage;

    if(enemy.hp < 0){
        enemy.hp = 0;
    }

    log(
        "🛡️ アイアンメイデン発動！ " +
        reflectDamage +
        "ダメージ反射！"
    );

    document.getElementById("enemyHp").textContent = enemy.hp;

    const percent = enemy.hp / enemy.maxHp * 100;
    document.getElementById("enemyHpBar").style.width =
        percent + "%";


    // 🛡️ 反射で敵を倒した場合
    if(enemy.hp <= 0){

        player.comboCount = 0;

        // 🏆 称号：素手でボス撃破
        if(
        enemy.boss &&
        player.equipment.weapon === "なし"
        ){

        player.titleBareHandBossWins++;

        

        if(player.titleBareHandBossWins >= 20){

        obtainTitle("真武闘");
        }
        }

        player.exp += enemy.exp;
        player.gold += enemy.gold;

        log(enemy.name + " を反射ダメージで倒した！");

        enemyDrop(enemy);
        rareEnemyDrop(enemy);

        while(player.exp >= player.nextExp){
            player.exp -= player.nextExp;
            levelUp();
        }

        updateScreen();

        if(enemy.boss){
            bossReward();
            unlockNextStage(currentDungeon);
        }

        inBattle = false;
        playTownBGM();

        autoSave();

        showBattleResult();

        return;
    }
    }

    if (player.hp <= 0) {
        player.hp = 0;
        updateScreen();

        alert("💀 GAME OVER");

        player.comboCount = 0;

        // 所持金10%減少
        player.gold = Math.floor(player.gold * 0.9);

        // HP全回復
        player.hp = player.maxHp;

        // MP全回復
        player.mp = player.maxMp;

        // 戦闘終了
        inBattle = false;

        playTownBGM();
        
        enemy = null;

        document.getElementById("battle").style.display = "none";

        log("💀 力尽きた…。町に戻り、HPが全回復した。（所持金10%減少）");

        updateScreen();

        autoSave();
        location.href = "index.html";

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

            player.comboCount = 0;

            // 🏆 称号：ノーダメージ勝利
            if(player.titleNoDamage){

            player.titleNoDamageWins++;

            log(
            `🏆 ノーダメージ勝利！ ` +
            `${player.titleNoDamageWins} / 10`
            );

            if(player.titleNoDamageWins >= 10){

            obtainTitle("初撃無効");
            }
            }

            // 🏆 称号：素手でボス撃破
            if(
            enemy.boss &&
            player.equipment.weapon === "なし"
            ){

            player.titleBareHandBossWins++;

            if(player.titleBareHandBossWins >= 20){

            obtainTitle("真武闘");
            }
            }


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
            playTownBGM();

            autoSave();

            showBattleResult();

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

// =========================
// 🔨 不滅／輪廻の判定
// =========================

function hasImmortalTraitCombo(){

    const equippedNames = [
        player.equipment?.weapon,
        player.equipment?.armor
    ];

    for(const name of equippedNames){

        if(!name) continue;

        const item = equipmentData.find(
            e => e.name === name
        );

        if(
            item &&
            item.crafted &&
            item.craftTraits &&
            item.craftTraits.includes("生命") &&
            item.craftTraits.includes("不死")
        ){

            return true;

        }

    }

    return false;
}
