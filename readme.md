# wp-boilerplate

This is a Wordpress starting boilerplate project.

It includes:
- SCSS + Bootstrap 5.3.0 support.
- Javascript transpiling to ES5.
- Timber (Twig) template engine.


# Initial setup

1. Run 'npm install' to install dependencies.
2. Run 



-----------


## Developing

The `src/`folder includes all the modified WP files plugin and theme files.
**Modifications should be done on this files.**

### Prerequisietes
An Apache local web server is needed to run Wordpress localy. The web server included on PHP 7.3+ will not have support for the needed .htaccess apache files.

Also you will need a MySQL server for the DataBase.

You can install and configure both manually, or install [XAMPP](https://www.apachefriends.org/es/index.html): https://www.apachefriends.org/es/index.html.

#### Setting up acustom virtualhost

1. Edit your local Hosts file and add a redirect for your WP domain:
    ```
    127.0.0.1 portfolio.wundermanlab.com.ar
    ```
    This will point the domain to your local machine.
    >**Note**: Yuo will require local admin permissions on your machine to save this changes.
2. Add the domain as a virtualhost in Apache's `httpd-vhosts.conf` file, using the right paths to the `dev/` folder:
    ```
    <VirtualHost *:80>
        DocumentRoot "/Users/ldasso/Work/wun-wt--portfolio-wordpress/dev"
        ServerName portfolio.wundermanlab.com.ar
        ErrorLog "/Users/ldasso/Work/wun-wt--portfolio-wordpress/dev/error_log"
        CustomLog "/Users/ldasso/Work/wun-wt--portfolio-wordpress/dev/access_log" common
    </VirtualHost>

    ```
    > **Note**: Make sure the `httpd-vhosts.conf` file is been included by the `httpd.conf` config file, as in some installations this is not the default.
3. Restart Apache to make this changes take effect.

#### Setting up the DataBase backup

WP will need access to it DataBase copy.

Xampp includes **phpMyAdmin** webtool to manage the local MySQL data bases.

1. Login to phpMyAdmin at http://localhost/phpMyAdmin.
    The default credentials are:
        - usr:  `root`
        - pwd: (leve empty)
2. Create a new DB
3. Import the backup DB  `.sql` file.

> **Note**: You  may need to increase the default phpMyAdmin import file size limit. To do so, locate the XAMPP's `php.ini` (ex: `xampp/php/php.ini`) file and add/update the following lines:
>``` ini
>max_execution_time = 5000
>max_input_time = 5000
>memory_limit = 1000M
>post_max_size = 750M
>upload_max_filesize = 750M
>```
>&nbsp;

### Coping Wordpress Core files

This repo do not include the Wordpress Core files. You need to download a fresh .zip WP copy from Wordpress official download page, and then unzip it on the folder wher you want to run Wordpress.

- For loca development, unzip it on the local `dev/` folder.
- For production, unzip it on the `prod/` folder.


### Gulp install
The repo includes a Gulp.js task for compiling the `src/` files for DEV and for PROD.

1. Open a terminal on the root folder of the repository.
2. Run `npm i`. This will install all the necessary dependencies.


### Compiling for DEV

This is the default gulp task. It will compile all the WP necessary files from the `src/` folder into the `dev/` folder,
and will keep a watch task on all the files, and live update the `dev/` folder if any change or modification is detected.

1. Open a terminal on the root folder of the repository.
2. Run `gulp` to start the default task.

### Compiling for PROD

This gulp task is meant to compile all the WP necessary files from the `src/` folder into the `dist/` folder, so to make them ready to deploy to PROD environment.

1. Open a terminal on the root folder of the repository.
2. Run `gulp build` to start the build task.

>**Note**: This will only compile the files on the `src/` folder. The Wordpress Core files need to be copy manually.
>Keep in mind not to ovewrite the custom `wp-config.php` file.

--------------------------------------

# WunPortfolio theme
## How to rse

### Create a new Campaign item

1. Login to WordPress as a _WIP_ or _Admin_ user.
2. Navigate to **Campaigns\Add New Campaign** admin menu.
3. Complete the campaign title.
4. Complete the Info options.
	- Contact information.
	- Expiring date.
5. Add one or more contents.
6. Select the terms in the texonomies (ex.: year, month).
7. Publish (or save as draft).


![](docs/imgs/campaing_options_content.png)

You can select 5 content types, each will display slightly different options.

| Option        | digital | animated | print | video | iframe |
|---------------|---------|----------|-------|-------|--------|
| Title         |    x    |     x    |   x   |   x   |    x   |
| Content Type  |    x    |     x    |   x   |   x   |    x   |
| Image         |    x    |     x    |   x   |       |    x   |
| Video URL     |         |          |       |   x   |        |
| Source URL    |         |          |       |       |    x   |
| Width         |         |          |       |       |    x   |
| Height        |         |          |       |       |    x   |
| Is Draft      |    x    |     x    |   x   |   x   |    x   |


#### Comments
- Youtube and Vimeo videos URL are supported.
- The video will display the default video thumb provided by the video service.
- For the Iframe content type, a width and height in pixels must be provided to set the correct preview size for the external content.
- You can select multiple image in the first content item, and a new content item will be automaticly added for each one.
- The format taxonomy will be auto selected based on the content type of the content items.
- The first content image will be used as the campaign thumbnail.
- You can rearrange the order of the contents items by drag and drop.



## Theme Customization 

Navigate to **Appearance\Cutsomize** admin menu to access all the theme options.

- **Site Identity**: 
	- Logo
	
	> **Note**: This logo will also be used on the login form.
	
	- Site title
	- Tagline
	- Display Site Title and Tagline
	- Site icon (favicon)/
- **Colors**: 
	- Background color
	- Filters Bar Gradient From
	- Filters Bar Gradient To
- **Header image**: You can select multiple headers, that will rotate automaticly.
- **Background Image**.
- **Menus**: You can activate and populate 3 menus locations.
	- Header menu.
	- Footer menu.
	- And page 404 menu.
	
	>**Note**: Any link to _Twitter_, _linkedIn_, _Facebook_, or _Instagram_ will be automaticly displayed as social icons.
	
- **Additional CSS**: Here you can add any CSS code you want to customize or modify the current site.


## Translations

The theme is prepared to be translated using [Poedit].

1. Install and start [PoEdit].
2. Create a new translation by openning the starter file **src/theme/languages/wunp.pot**.
3. Select the translation language.
4. Select the string to translate in column **Source**.
5. Write the translated text on **Trnslation** textarea.
6. Save your changes to create/update the final **.po** and **.mo** files needed to translate wordpress.
7. Make sure to copy the final **.mo** file to **\wp-content\themes\wun-portfolio\languages** folder.


## User levels and capabilites

There are 5 user types, each with different levels of capabilities and access.

1. **Unregister users**:
	- Can only navigate the site.
	- Can only see _public_ campaigns.
	
	>**Note**: you can lock down the site for any unregister user by activating the **wp-force-login** plugin, included in this repository.

2. **Guest** users:
	- Can only navigate the site.
	- Can see _public_ and _private_ posts.
3. **WIP Guest** users:
	- Can only navigate the site.
	- Can see _public_, _private_ and _WIP_ (aka draft) posts.
4. **WIP** users:
	- Can access the admin.
	- Can create/modify/delete campaigns.
	- Can see _public_, _private_, and _WIP_ (aka draft) posts.
5. **Administrator** users:
	- Can access the admin.
	- Can create/modify/delete campaigns.
	- Can see all types of posts.
	- Can access all worpress options natural for the admin user.
6. **SuperAdmin** users:
	- All of the above.
	- Can access the Network admin dashboard.


---
 
## Hosting Requirements

### Wordpress

As recomenden by Wordpress:

- Apache webserver
- PHP version 7.4+
- MySQL version 5.6+
- HTTPS support
 
#### Plugins

- [ACF Pro] (for WP)
- [Isotope.js]
- [Fancybox3]




[ACF Pro]: https://www.advancedcustomfields.com/pro/#pricing-table
[Fancybox3]: http://fancyapps.com/fancybox/3/
[Poedit]: https://poedit.net/
