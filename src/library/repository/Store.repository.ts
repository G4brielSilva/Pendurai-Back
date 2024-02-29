import { DeepPartial, Repository } from 'typeorm';
import { IListParams } from '../../common/models/BaseController';
import { TObject } from '../../common/models/TObject';
import { EnumRoles } from '../../common/models/enum/EnumRoles';
import { dataSource } from '../../config/database';
import { Store } from '../entity';

export class StoreRepository {
    repository: Repository<Store>;

    public constructor() {
        this.repository = dataSource.getRepository(Store);
    }

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

        const options: TObject = { skip, take };

        // Listando apenas as lojas vinculadas ao usuário caso este não seja admin
        if (role !== EnumRoles.ADMIN) options.where = { owner };

        if (params.order) options.order = { [params.order]: params.orderBy };

        return this.repository.find(options);
    }
}
