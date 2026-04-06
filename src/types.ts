export interface Pet {
  id: string;
  name: string;
  breed: string;
  age: string;
  gender: 'male' | 'female';
  weight: string;
  distance: string;
  image: string;
  images: string[];
  tags: string[];
  health: {
    vaccination: boolean;
    sterilization: boolean;
    deworming: boolean;
    description: string;
  };
  story: string;
  category: 'dog' | 'cat' | 'small';
  isFavorite?: boolean;
}

export interface RescueStation {
  id: string;
  name: string;
  distance: string;
  status: string;
  tags: string[];
  image: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export interface Application {
  id: string;
  petName: string;
  petImage: string;
  breed: string;
  age: string;
  location: string;
  status: 'pending' | 'approved' | 'rejected';
  progress: number;
}
