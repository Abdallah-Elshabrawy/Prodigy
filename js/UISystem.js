function UISystem(id, game)
{
    var ID = id;
    this.GetID = function () { return ID; }
    this.SetID = function (newID) { ID = newID; }
    this.game = game;
    
    this.HUDComponents = [];
    var baseValue = 0.45;

    this.skillActiveImage;
    this.skillBar;
    this.skillBarPosX = 300;
    this.skillBarPosY= 520;
    this.skillInfo;
    this.skillInfoText;

    this.CreateHUD = function (entitiesArray)
    {
        var yAxis = 0;
        var yAxisAI = 0;
        var tempArray = [];
  
        entitiesArray.forEach(function (entity)
        {
            var tempUI = new UIComponent(entity);
            //this.HUDComponents.push(tempUI);
            tempArray.push(tempUI);

            if (entity.Type === 'Player')
            {
                tempUI.Image = game.add.sprite(10, 10 + (yAxis * 55), 'heroWindow');
                tempUI.Image.scale.setTo(0.45, 0.45);
                //tempUI.OwnerIcon = game.add.sprite(0, 0, 'heroWindow');
                tempUI.HealthBar = game.add.sprite(Math.floor(tempUI.Image.x + tempUI.Image.width / 2) - 19, (Math.floor(tempUI.Image.y + tempUI.Image.height / 2) - 6), 'healthBar');
                tempUI.HealthBar.scale.setTo(baseValue, baseValue);
                tempUI.EnergyBar = game.add.sprite(Math.floor(tempUI.Image.x + tempUI.Image.width / 2) - 19, (Math.floor(tempUI.Image.y + tempUI.Image.height / 2) + 6), 'energyBar');
                tempUI.EnergyBar.scale.setTo(baseValue, baseValue);
                yAxis++;
            }
            else
            {
                tempUI.Image = game.add.sprite(775, 10 + (yAxisAI * 55), 'heroWindow');
                tempUI.Image.scale.setTo(0.45, 0.45);
                tempUI.Image.scale.x *= -1;
                //tempUI.OwnerIcon = game.add.sprite(0, 0, 'heroWindow');
                tempUI.HealthBar = game.add.sprite(tempUI.Image.x - 58, tempUI.Image.y + 24, 'healthBar');
                tempUI.HealthBar.scale.setTo(baseValue, baseValue);
                tempUI.HealthBar.anchor.set(1, 0.5);
                tempUI.EnergyBar = game.add.sprite(tempUI.Image.x - 58, tempUI.Image.y + 36, 'energyBar');
                tempUI.EnergyBar.scale.setTo(baseValue, baseValue);
                tempUI.EnergyBar.anchor.set(1, 0.5);
                yAxisAI++;
            }
        });

        this.HUDComponents = tempArray;
    }
    this.CreateSkillsUI= function()
    {
        //skills bar
        this.skillBar = this.game.add.sprite(this.skillBarPosX, this.skillBarPosY, 'SkillBar');
        this.skillBar.scale.setTo(1.5, 1.5);
        this.skillBar.visible = false;
        //skill info window
        this.skillInfo = game.add.sprite(0, 0, 'SkillWindow').alignTo(this.skillBar, Phaser.TOP_CENTER, -78, -50);
        this.skillInfo.scale.setTo(2.5, 0.5);
        this.skillInfo.visible = false;
        //skill info text
        var style = { font: "18px Arial", fill: "#ffffff", wordWrap: true, wordWrapWidth: this.skillInfo.width, align: "center" };
        this.skillInfoText = game.add.text(0, 0, "skill", style).alignTo(this.skillInfo, Phaser.TOP_CENTER, 15, -55);;
        this.skillInfoText.anchor.set(0.5);
        this.skillInfoText.visible = false;
        //skill active image
        this.skillActiveImage = this.game.add.sprite(0, 0, 'SkillActive');
        this.skillActiveImage.visible = false;
        this.skillActiveImage.scale.setTo(0.12, 0.12);
    }
    this.SkillBarVisible = function (value) { this.skillBar.visible = value; }
    this.SkillInfoVisible = function (value) { this.skillInfo.visible = value; }
    this.SkillInfoTextVisible = function (value) { this.skillInfoText.visible = value; }
    this.UpdateUIComponent = function (actor, target)
    {
        var actorUI = this.HUDComponents.filter(function (obj) { return obj.Owner === actor; });
        actorUI[0].EnergyBar.scale.setTo(baseValue * (actor.currentEnergy / actor.InitEnergy), baseValue);

        var targetUI = this.HUDComponents.filter(function (obj) { return obj.Owner === target; });
        targetUI[0].HealthBar.scale.setTo(baseValue * (target.currentHealth / target.InitHealth), baseValue);
    }

}