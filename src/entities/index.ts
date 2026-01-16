/**
 * Auto-generated entity types
 * Contains all CMS collection interfaces in a single file 
 */

/**
 * Collection ID: bookings
 * Interface for PatientBedBookings
 */
export interface PatientBedBookings {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  patientName?: string;
  /** @wixFieldType text */
  patientContactNumber?: string;
  /** @wixFieldType text */
  patientEmail?: string;
  /** @wixFieldType text */
  bedIdentifier?: string;
  /** @wixFieldType datetime */
  bookingStartDate?: Date | string;
  /** @wixFieldType datetime */
  bookingEndDate?: Date | string;
  /** @wixFieldType text */
  bookingStatus?: string;
}


/**
 * Collection ID: hospitalbeds
 * Interface for HospitalBeds
 */
export interface HospitalBeds {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  bedNumber?: string;
  /** @wixFieldType text */
  department?: string;
  /** @wixFieldType text */
  roomType?: string;
  /** @wixFieldType text */
  status?: string;
  /** @wixFieldType boolean */
  isAvailable?: boolean;
  /** @wixFieldType datetime */
  lastUpdated?: Date | string;
}


/**
 * Collection ID: hospitals
 * Interface for HospitalProfiles
 */
export interface HospitalProfiles {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  hospitalName?: string;
  /** @wixFieldType text */
  address?: string;
  /** @wixFieldType text */
  city?: string;
  /** @wixFieldType text */
  stateProvince?: string;
  /** @wixFieldType text */
  zipPostalCode?: string;
  /** @wixFieldType text */
  country?: string;
  /** @wixFieldType number */
  latitude?: number;
  /** @wixFieldType number */
  longitude?: number;
  /** @wixFieldType text */
  phoneNumber?: string;
  /** @wixFieldType text */
  emailAddress?: string;
  /** @wixFieldType url */
  websiteUrl?: string;
  /** @wixFieldType text */
  description?: string;
  /** @wixFieldType image - Contains image URL, render with <Image> component, NOT as text */
  hospitalImage?: string;
}
