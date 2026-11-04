Auth pages for pickup

I have created a schema that I've put in the auth folder. I need feedback on it.

Top down IMPORTANT requirements:

- Only 'Monforte de Lemos' will be included as a city location.
- Only 'Padel' will be included as a sport.
- Only 'Pádel'Ante Club', 'Lemos Padel', 'Club Fluvial Monforte', 'Sacra Pádel Monforte' will be included as venues. I need the ability to add new venues, and to mark venues as unavailable, but still retain all data relating to past matches played.
- I need to be able to create and to delete users with permissions to start their own matches, delete only their own matches, and to join other matches. 
- All matches previously played will be retained on the database.
- Users can create templates for matches and save these to their profile.
- Development will progress after these key requirements are met.

User management:

- Since the product is in Alpha, it is invite only. I will provide the username and password for each account right now. In the future, I want to users to be able to create their own accounts, and I will need options to login via google, apple, Microsoft, etc.

- No email confirmation right now, since I am providing the credentials for each user.

- I will add these users myself, and populate their profile manually. I need ideas on how to do this.

	Permissions:

		- Users can create upcoming matches.
		- They can cancel matches they have created.
		- They can join matches.
		- They can leave matches.
		- Users can view upcoming matches using the find a game button that is included on the homepage and sidebar.
		- Users can start a game using the start a game button that is included on the homepage and sidebar.

- Users will log in with the credentials I provide them with.

- I can delete or add new users when I want.



