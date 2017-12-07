function BattleSystem(id)
{
    var ID = id;
    var Entities = [];
    this.GetID = function () { return ID; } 
    this.SetID = function (newID) { ID = newID; }
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

