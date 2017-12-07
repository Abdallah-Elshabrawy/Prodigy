
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'content', { preload: this.preload, create: this.create, update: this.update, render: this.render  });

function preload()
{
    //Images
    game.load.image('BG', 'assets/BG.png');
    game.load.image('SkillBar', 'assets/UI/SkillBar.png');
    game.load.image('SkillWindow', 'assets/UI/panel_brown.png')
    game.load.image('heroWindow', 'assets/UI/heroFrame.png')  
    game.load.image('healthBar', 'assets/UI/health_points.png')  
    game.load.image('energyBar', 'assets/UI/rp_mana.png')  
    //Sprite Sheets Heroes
    game.load.atlas('KnightSprite', 'assets/Heroes/Knight.png', 'assets/Heroes/Knight_json.json');
    game.load.atlas('WarlockSprite', 'assets/Heroes/Warlock.png', 'assets/Heroes/Warlock_json.json');
    game.load.atlas('ThiefSprite', 'assets/Heroes/Thief.png', 'assets/Heroes/Thief_json.json');
    game.load.atlas('SkillSprite', 'assets/Skills/Skills.png', 'assets/Skills/Skills_json.json');
    //Sprite Sheets Enemies
    game.load.atlas('SteamSprite', 'assets/Heroes/SteamVamp.png', 'assets/Heroes/SteamVamp_json.json');
    game.load.atlas('GhoulSprite', 'assets/Heroes/Ghoul.png', 'assets/Heroes/Ghoul_json.json');
    game.load.atlas('NosferatuSprite', 'assets/Heroes/Nosferatu.png', 'assets/Heroes/Nosferatu_json.json');
    //Data
    game.load.text('heroes', 'assets/Data/Heroes.json');
    game.load.text('enemies', 'assets/Data/enemies.json');
    //Audio
    //game.load.audio('boden', ['assets/audio/bodenstaendig_2000_in_rock_4bit.mp3', 'assets/audio/bodenstaendig_2000_in_rock_4bit.ogg']);
}

var UIManager;
var battleManager;
var entitiesArray;
var currentHero;
var currentSkill;

function create() {
    this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    //Create background
    var background = game.add.sprite(0, 0, 'BG');
    //create UI Manager
    UIManager = new UISystem("UIManager", this.game);
    //create Skills UI
    UIManager.CreateSkillsUI();
    //create Battle System
    battleManager = new BattleSystem("BattleManager");
    //create heroes
    CreateBattleEntities();
    //Display Sprite
    DisplayEntities();
    //create HUD
    UIManager.CreateHUD(battleManager.GetEntitiesArray());
    //Start Battle
    SwitchTurn();

    //SFX
    //FX
    //start screen //tween
    //end screen
    //port to android
}

function CreateBattleEntities() {
    var heroesList = JSON.parse(game.cache.getText('heroes'));
    heroesList.Heroes.forEach(function (element) {
        var tempHero = new Hero(element.ID,
            element.Type,
            element.Health,
            element.Energy,
            element.SpriteName);

        tempHero.Animations = element.Animation;
        tempHero.PosX = element.x;
        tempHero.PosY = element.y;
        tempHero.IsAlive = true;

        element.Skills.forEach(function (skill) {
            tempHero.Skills.push(new Skill(skill.ID, skill.Type, skill.Damage, skill.Cost, skill.SpriteName));

        }, this);

        battleManager.SubscribeEntity(tempHero);

    }, this);

    var enemiesList = JSON.parse(game.cache.getText('enemies'));
    enemiesList.Heroes.forEach(function (element) {
        var tempHero = new Hero(element.ID,
            element.Type,
            element.Health,
            element.Energy,
            element.SpriteName);

        tempHero.Animations = element.Animation;
        tempHero.PosX = element.x;
        tempHero.PosY = element.y;
        tempHero.IsAlive = true;

        element.Skills.forEach(function (skill) {
            tempHero.Skills.push(new Skill(skill.ID, skill.Type, skill.Damage, skill.Cost, skill.SpriteName));
        }, this);

        battleManager.SubscribeEntity(tempHero);

    }, this);
}

function DisplayEntities() {
    var entitiesGroup = game.add.group();
    entitiesArray = battleManager.GetEntitiesArray();

    entitiesArray.forEach(function (entity) {
        entity.SetSpriteObject(entitiesGroup.create(entity.PosX, entity.PosY, entity.SpriteName));
        entity.InitAnimations();
        entity.GetSpriteObject().animations.play('idle');
        entity.GetSpriteObject().inputEnabled = true;
        entity.GetSpriteObject().input.pixelPerfectClick = true;
        entity.GetSpriteObject().events.onInputDown.add(OnEntityClick, this, 0, entity);

        if (entity.Type === 'Player') {
            entity.GetSpriteObject().scale.setTo(4, 4);
        }
        else {
            entity.GetSpriteObject().scale.setTo(3, 3);
            entity.GetSpriteObject().scale.x *= -1;
        }

        var factor = -1;
        var offset = 70;
        entity.Skills.forEach(function (skill) {
            factor++;

            skill.SetSpriteObject(game.add.image(UIManager.skillBarPosX + 10 + (offset * factor), UIManager.skillBarPosY + 10, "SkillSprite", skill.SpriteName));

            skill.GetSpriteObject().inputEnabled = true;
            skill.GetSpriteObject().events.onInputDown.add(OnSkillClick, this, 0, skill);
            skill.GetSpriteObject().events.onInputOver.add(OnSkillOver, this, 0, skill);
            skill.GetSpriteObject().events.onInputOut.add(OnSkillOut, this, 0, skill);
            skill.GetSpriteObject().scale.setTo(0.12, 0.12);
            skill.GetSpriteObject().visible = false;
        });
    });

    entitiesGroup.sort('y', Phaser.Group.SORT_ASCENDING);
}

function SwitchTurn() {
    currentHero = battleManager.GetEntityTurn();

    if (currentHero != null) {
        StartTurn();
    }
    else {
        battleManager.ResetTurns();
        SwitchTurn();
    }
}

function StartTurn() {
    if (currentHero.Type === 'Player') {
        UIManager.SkillBarVisible(true);

        currentHero.Skills.forEach(function (skill) {
            skill.GetSpriteObject().visible = true;
        });
    }
    else {
        StartTurnAI();
    }

}

function EndTurn() {
    //disable UI if visible
    if (currentHero.Type === 'Player') {
        UIManager.SkillBarVisible(false);

        currentHero.Skills.forEach(function (skill) {
            skill.GetSpriteObject().visible = false;
        });
    }

    //reset Skill
    currentSkill.Active = false;
    currentSkill = false;
    //mark hero turn complete
    currentHero.IsCompleteTurn = true;

    //move to next entity turn
    SwitchTurn();
}

function OnSkillOver(sprite, pointer, skill) {
    UIManager.SkillInfoVisible(true);
    UIManager.skillInfoText.text = skill.ID + ": Damage " + skill.Damage + ",Energy " + skill.Cost;
    UIManager.SkillInfoTextVisible(true);
}

function OnSkillOut(sprite, pointer, skill) {
    UIManager.SkillInfoVisible(false);
    UIManager.SkillInfoTextVisible(false);
}

function OnSkillClick(sprite, pointer, skill) {
    if (currentSkill == null) {
        currentSkill = skill;
        currentSkill.Active = true;
        console.log("Skill Active: " + currentSkill);
    }
    else {
        currentSkill.Active = false;

        if (currentSkill == skill) {
            currentSkill = null;
            console.log("Same Skill, no active skill");
        }
        else {
            currentSkill = skill;
            currentSkill.Active = true;
            console.log("different skill: " + currentSkill);
        }
    }
}

function OnEntityClick(sprite, pointer, entity) {
    if (currentSkill != null && currentSkill.Active) {
        if ((entity.Type === 'AI') && (currentSkill.Type == 'Enemy')) {
            console.log(currentHero.ID + " attack " + entity.ID);

            currentHero.GetSpriteObject().animations.play('attack');
            currentHero.UpdateEnergy(currentSkill.Cost);

            entity.ApplyDamage(currentSkill.Damage);
            UIManager.UpdateUIComponent(currentHero, entity);
            EndTurn();
        }
        else if ((entity.Type === 'Player') && (currentSkill.Type == 'Ally')) {
            console.log(currentHero.ID + " Help " + entity.ID);

            currentHero.GetSpriteObject().animations.play('attack');
            currentHero.UpdateEnergy(currentSkill.Cost);

            entity.UpdateHealth(currentSkill.Damage);

            UIManager.UpdateUIComponent(currentHero, entity);
            EndTurn();
        }
    }
    //else if ((entity.Type === 'Player') && (currentHero !=  entity))
    //{
    //    currentHero.Skills.forEach(function (skill)
    //    {
    //        skill.GetSpriteObject().visible = false;
    //    });
    //    currentHero = entity;
    //    currentHero.Skills.forEach(function (skill)
    //    {
    //        skill.GetSpriteObject().visible = true;
    //    });
    //    console.log("Switch Player");
    //}
}

function StartTurnAI()
{
    currentSkill = currentHero.Skills[Math.floor(Math.random() * currentHero.Skills.length)];
    currentSkill.Active = true;
    var target;

    if (currentSkill.Type == 'Enemy') {
        console.log("AI attack player");

        var playerList = battleManager.GetEntitiesArray().filter(function (obj) { return obj.Type === 'Player'; });
        target = playerList[Math.floor(Math.random() * playerList.length)];

        currentHero.GetSpriteObject().animations.play('attack');
        currentHero.UpdateEnergy(currentSkill.Cost);

        target.GetSpriteObject().animations.play('hurt');
        target.ApplyDamage(currentSkill.Damage);
    }
    else if (currentSkill.Type == 'Ally') {
        console.log("AI Help Ally");

        var playerList = battleManager.GetEntitiesArray().filter(function (obj) { return obj.Type === 'AI'; });
        target = playerList[Math.floor(Math.random() * playerList.length)];

        currentHero.GetSpriteObject().animations.play('attack');
        currentHero.UpdateEnergy(currentSkill.Cost);

        target.GetSpriteObject().animations.play('hurt');
        target.UpdateHealth(currentSkill.Damage);
    }

    UIManager.UpdateUIComponent(currentHero, target);

    game.time.events.add(Phaser.Timer.SECOND * 2, EndTurn, this);

    //EndTurn();
}

