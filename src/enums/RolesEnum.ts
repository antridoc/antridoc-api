
export enum RolesEnum {
    SUPER_ADMIN = 'super_admin',
    ADMIN = 'admin',
    OWNER_HOSPITAL = 'owner_hospital',
    ADMIN_HOSPITAL = 'admin_hospital',
    ADMIN_POLI = 'admin_poli',
    PATIENT = 'patient',
    DEFAULT = 'patient',
}

export const app_allow_roles: RolesEnum [] = [
    RolesEnum.PATIENT,
    RolesEnum.ADMIN_HOSPITAL,
    RolesEnum.ADMIN_POLI,
]