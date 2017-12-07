function Skill(id, type, damage,cost, sprite)
{
    this.ID = id;
    this.Type = type;
    this.Damage = damage;
    this.Cost = cost;
    this.SpriteName = sprite;
    this.Active = false;

    var SpriteObject;
    this.SetSpriteObject = function (sprite) { this.SpriteObject = sprite; }
    this.GetSpriteObject = function () { return this.SpriteObject; }
}