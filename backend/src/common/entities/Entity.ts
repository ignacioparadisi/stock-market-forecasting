export abstract class Entity {
    id?: number;

    protected constructor(
        entity?: Entity
    ) {
        this.id = entity?.id ? Number(entity.id) : undefined;
    }
}