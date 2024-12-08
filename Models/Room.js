type Availability = {
  [time: string]: "0" | "1";
}

interface Room {
  name: string;
  capacity: string;
  level: string;
  availability: Availability;
}