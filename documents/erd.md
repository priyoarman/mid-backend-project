# This schema manages a basic Event system where Users act as organizers.

- USER: Stores identity info (ID, Unique Email, Name).

- EVENT: Stores listing details (ID, Title, Price, Description) and metadata.

- Link: The organizer_id (Foreign Key) connects each event to exactly one user.

- Logic: One user can create many events, but each event belongs to only one creator.