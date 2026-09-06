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



    player.hp -= damage;

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
        enemy = null;

        document.getElementById("battle").style.display = "none";

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

            player.comboCount = 0;

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
