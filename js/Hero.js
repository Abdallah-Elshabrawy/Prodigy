function Hero(id, type, health, energy, sprite)
{
    Entity.call(this, id, type, health, energy, sprite);
}
Hero.prototype = Object.create(Entity.prototype);
Hero.prototype.constructor = Hero;