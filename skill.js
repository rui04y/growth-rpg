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
            getTotalAtk() * (2 + (player.skills.strong.level - 1) * 0.5) +
            Math.floor(Math.random() * 10);


        // 🌲 森王の剣
        if(player.effects && player.effects.includes("skillPowerUp")){
            damage = damage * 1.1;
            log("🌲 森王の剣の効果発動！");
        }

        // 🪨 岩王の剣
        if(player.effects && player.effects.includes("skillPowerUp15")){
            damage = damage * 1.15;
            log("🪨 岩王の剣の効果発動！");
        }

        // 👿 魔王の剣
        if(player.effects && player.effects.includes("allSkillPowerUp")){
            damage = damage * 1.15;
            log("👿 魔王の剣の効果発動！");
        }

        // 📖 ネクロノミコン
        if(player.effects && player.effects.includes("skillDamageUp5")){
            damage = damage * 1.05;
            log("📖 ネクロノミコンの効果発動！ スキルダメージ +5%");
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
            getTotalAtk() * (1.5 + (player.skills.fireball.level - 1) * 0.5) +
            Math.floor(Math.random() * 10);


        // 🔥 炎帝の剣
        if(player.effects && player.effects.includes("fireballPowerUp")){
            damage = damage * 1.2;
            log("🔥 炎帝の剣の効果発動！");
        }

        // 👿 魔王の剣
        if(player.effects && player.effects.includes("allSkillPowerUp")){
            damage = damage * 1.15;
            log("👿 魔王の剣の効果発動！");
        }

        // 📖 ネクロノミコン
        if(player.effects && player.effects.includes("skillDamageUp5")){
            damage = damage * 1.05;
            log("📖 ネクロノミコンの効果発動！ スキルダメージ +5%");
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
            getTotalAtk() * (5 + (player.skills.ultimate.level - 1) * 0.5) +
            Math.floor(Math.random() * 20);


        // 👿 魔王の剣
        if(player.effects && player.effects.includes("allSkillPowerUp")){
            damage = damage * 1.15;
            log("👿 魔王の剣の効果発動！");
        }

        // 📖 ネクロノミコン
        if(player.effects && player.effects.includes("skillDamageUp5")){
            damage = damage * 1.05;
            log("📖 ネクロノミコンの効果発動！ スキルダメージ +5%");
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
            getTotalAtk() * (2.5 + (player.skills.thunder.level - 1) * 0.5) +
            Math.floor(Math.random() * 15);


        // 👿 魔王の剣
        if(player.effects && player.effects.includes("allSkillPowerUp")){
            damage = damage * 1.15;
            log("👿 魔王の剣の効果発動！");
        }

        // 📖 ネクロノミコン
        if(player.effects && player.effects.includes("skillDamageUp5")){
            damage = damage * 1.05;
            log("📖 ネクロノミコンの効果発動！ スキルダメージ +5%");
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

        player.comboCount = 0;

        player.exp += enemy.exp;
        player.gold += enemy.gold;

        enemyDrop(enemy);
        rareEnemyDrop(enemy);

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
