export interface CoursePartBase {
  name: string;
  exerciseCount: number;
}

export interface CoursePartDescription extends CoursePartBase {
  description: string;
}

export interface CoursePartGroup extends CoursePartBase {
  groupProjectCount: number;
  kind: 'group';
}

export interface CoursePartBasic extends CoursePartDescription {
  kind: 'basic';
}

export interface CoursePartSpecial extends CoursePartDescription {
  requirements: string[];
  kind: 'special';
}

export interface CoursePartBackground extends CoursePartDescription {
  backgroundMaterial: string;
  kind: 'background';
}

export type CoursePart =
  | CoursePartBasic
  | CoursePartGroup
  | CoursePartSpecial
  | CoursePartBackground;
