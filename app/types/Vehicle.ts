export interface NewVehicle {
  vehicleName: string;
  initialOdometer: number;
  estimatedMiles: number;
  nextOilChange: number;
  ownerId: string;
  image?: string; // Optional property for the vehicle image
  invitedUsers: string[]; // Array for invited users
  pendingInvites: string[]; // Array for pending invites
}

export interface Vehicle extends NewVehicle {
  id: string; // Include the id property for existing vehicles
}

export const createNewVehicle = (
  vehicleName: string = "Unnamed Vehicle",
  initialOdometer: number = 0,
  nextOilChange: number = 5000,
  ownerId: string = "unknown",
  image: string = "default.png"
): NewVehicle => {
  return {
    vehicleName,
    initialOdometer,
    estimatedMiles: 0,
    nextOilChange,
    ownerId,
    image,
    invitedUsers: [], // Initialize as an empty array
    pendingInvites: [], // Initialize as an empty array
  };
}; 