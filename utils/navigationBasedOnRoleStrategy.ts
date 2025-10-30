import { Role } from '@services/interfaces/TipoUsuario.interface';

const navigationBasedOnRoleStrategy = new Map<Role, { data: string }>();
navigationBasedOnRoleStrategy.set(Role.PROFESIONAL, { data: 'profesional' });
navigationBasedOnRoleStrategy.set(Role.RECLUTADOR, { data: 'reclutador' });

export default navigationBasedOnRoleStrategy;
