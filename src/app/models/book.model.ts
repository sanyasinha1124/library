export interface Book {
  id:               number;
  userId:           number;
  title:            string;
  body:             string;
  author:           string;
  isbn:             string;
  publisher:        string;
  publishedDate:    string;
  publishedYear?:   number;
  category:         string;
  totalCopies:      number;
  availableCopies:  number;
  issuedCopies:     number;
  position:         string;
  addedDate:        string;
  addedBy:          string;
  coverImage?:      string;
}
