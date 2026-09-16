export interface City {
  id: string;
  name: string;
  state: string;
}

export interface Area {
  id: string;
  cityId: string;
  name: string;
}