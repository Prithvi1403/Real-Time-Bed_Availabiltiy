/**
 * Auto-generated entity types
 * Contains all CMS collection interfaces in a single file 
 */

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
