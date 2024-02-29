import { DeepPartial, FindManyOptions, Repository } from 'typeorm';
import { IListParams } from '../../common/models/BaseController';
import { BaseRepository } from '../../common/models/BaseRepository';
import { TObject } from '../../common/models/TObject';
import { EnumRoles } from '../../common/models/enum/EnumRoles';
import { Store } from '../entity';

export class StoreRepository extends BaseRepository<Store> {
    repository: Repository<Store>;

    /**
     * insert
     *
     * Insere uma loja no banco
     *
     * @param { DeepPartial<Store> } store
     * @returns { Promise<Store> }
     */
    public async insert(store: DeepPartial<Store>): Promise<Store> {
        return this.repository.save(this.repository.create(store));
    }

    /**
     * list
     *
     * Lista as lojas relacionadas ao usuário
     *
     * @param { string } owner
     * @param { EnumRoles } role
     * @param { IListParams } params
     * @returns { Promise<Store[]> }
     */
    public async list(owner: string, role: EnumRoles, params: IListParams): Promise<Store[]> {
        const skip = params.size * params.page;
        const take = params.size;

        const options: FindManyOptions<Store> = { skip, take };
        let where: TObject = {};

        // Listando apenas as lojas vinculadas ao usuário caso este não seja admin
        if (role !== EnumRoles.ADMIN) where = { owner };

        options.where = where;

        if (params.order) options.order = { [params.order]: params.orderBy };

        return this.repository.find(options);
    }

    /**
     * findById
     *
     * Lista a loja relacionadas ao usuário
     *
     * @param { string } storeId
     * @param { string } owner
     * @param { EnumRoles } role
     * @returns { Promise<Store | null> }
     */
    public async findStoreById(storeId: string, owner: string, role: EnumRoles): Promise<Store | null> {
        const options: FindManyOptions<Store> = {};
        const where: TObject = { id: storeId };

        if (role !== EnumRoles.ADMIN) where.owner = owner;

        options.where = where;

        return this.repository.findOne(options);
    }
}
