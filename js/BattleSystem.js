function BattleSystem(id)
{
    var ID = id;
    var Entities = [];
    this.GetID = function () { return ID; } 
    this.SetID = function (newID) { ID = newID; }
    this.CreateBattleEntities = function (entitiesList)
    {
        entitiesList.Heroes.forEach(function (element)
        {
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

            this.SubscribeEntity(tempHero);

        }, this);
    }
    this.GetEntitiesArray = function () { return Entities; }
    this.SubscribeEntity = function (newEntity) { Entities.push(newEntity); }
    this.UnsubscribeEntity = function (removeEntity)
    {
        Entities.splice(Entities.indexOf(removeEntity),1);
    }
    this.GetEntityTurn = function ()
    {
        for (var x = 0; x < Entities.length; x++)
        {
            if (Entities[x].IsAlive && Entities[x].IsCompleteTurn === false)
            {
                console.log(Entities[x].ID + " Turn " + Entities[x].Type);
                return Entities[x];
            }
        }

        return null;
    }
    this.ResetTurns = function ()
    {
        for (var x = 0; x < Entities.length; x++)
        {
            Entities[x].IsCompleteTurn = false
        }
    }
}

