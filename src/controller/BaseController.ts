import Entity from "../entity";

export default class BaseController {
    protected m_entity: Entity;

    public constructor()
    {
        this.m_entity = global._entity;
    }
}