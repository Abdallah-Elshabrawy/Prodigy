function Entity(id, type, health, energy, sprite)
{  
    this.ID = id;
    this.Type = type;
    this.InitHealth = health;
    this.InitEnergy = energy;
    this.SpriteName = sprite;
    this.PosX = 0;
    this.PosY = 0;
    this.Animations = [];
    this.Skills = [];
    this.IsCompleteTurn = false;
    this.IsAlive = false;

    var SpriteObject;
    this.SetSpriteObject = function (sprite) { this.SpriteObject = sprite; }
    this.GetSpriteObject = function () { return this.SpriteObject; }

    this.currentHealth = this.InitHealth;
    this.currentEnergy = this.InitEnergy;
}
Entity.prototype.InitAnimations = function ()
{    
    for (var x = 0; x < this.Animations.length; x++)
    {
        var tempAnim = this.SpriteObject.animations.add(this.Animations[x].ID, Phaser.Animation.generateFrameNames(this.Animations[x].Prefix, this.Animations[x].Start, this.Animations[x].End), this.Animations[x].FPS, this.Animations[x].Loop);

        if (this.Animations[x].Callback)
        {
            tempAnim.onComplete.add(this.animationCompleted, this);
        }
    }
}
Entity.prototype.animationCompleted = function (sprite, animation)
{
    this.SpriteObject.animations.play('idle');
}
Entity.prototype.ApplyDamage = function (value)
{
    this.currentHealth -= value;

    if (this.currentHealth <= 0)
    {
        this.currentHealth = 0;
        this.SpriteObject.inputEnabled = false;
        this.SpriteObject.animations.play("die");
        this.IsAlive = false;
    }
    else
    {
        this.SpriteObject.animations.play("hurt");
    }
}
Entity.prototype.UpdateHealth = function (value)
{
    this.currentHealth += value;

    if (this.currentHealth > this.InitHealth)
    {
        this.currentHealth = this.InitHealth;
    }
}
Entity.prototype.UpdateEnergy = function (value) { this.currentEnergy -= value; }