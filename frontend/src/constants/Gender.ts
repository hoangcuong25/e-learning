export enum GenderEnum {
  Male = "MALE",
  Female = "FEMALE",
  Other = "OTHER",
}

export const GenderLabel: Record<GenderEnum, string> = {
  [GenderEnum.Male]: "Nam",
  [GenderEnum.Female]: "Nữ",
  [GenderEnum.Other]: "Khác",
};
