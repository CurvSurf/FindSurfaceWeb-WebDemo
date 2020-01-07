# FindSurfaceWeb-WebDemo

**Curv*Surf* FindSurface™ Web** - WebDemo

## Requirement

This demo requires a browser that supports WebGL 1.0 in order to run properly. We recommend you to test the demo using one of the following browsers:

- Internet Explorer 11+
- Microsoft Edge browser 12+
- Opera 12+
- Chrome 9+
- Safari 5.1+
- FireFox 4+

The demo has been developed using pure HTML5 and CSS3 without any JQuery or Bootstrap stuff.

An internet connection is required since the demo communicates with FindSurfaceWeb server.

## Usage

You can try this demo [here](https://developers.curvsurf.com/WebDemo) in advance. You may test it using your own point-cloud files (currently, the supported format is .xyz only) or preset files listed in the loading menu.

The demo client itself will work on your local machine (just by executing index.html on your web browser), but we **strongly recommend you to build your own local server for the client**, at least, in order to try this demo; otherwise, loading preset files will fail due to security issues since the demo client uses XMLHttpRequest to load the preset files.

In case of running the demo without a local server, you may download [these files](xyz) and load them using the [Use Local File] menu in the demo.

A user manual can be found at [here](https://developers.curvsurf.com/WebDemo/Manual/overview.html).


## File Descriptions

### CSS

| File Name | Description |
|:-:|:-|
| dialog.css | Style Define related with Dialog |
| panels.css | Style Define related with Panel |

### JavaScript

#### Define Variables or Constants

| File Name | Description |
|:-:|:-|
| globalvar.js | Define Global Variables |
| error_message.js | Define Error Messages |

#### Dialog

| File Name | Description |
|:-:|:-|
| file_open_dialog.js | File Open Dialog |
| param_dialog.js | Set Parameter Dialog |
| help_dialog.js | Help Dialog |
| alert_dialog.js | Alert and Confirm Dialog |
| color_picker_dialog.js | Color Picker Dialog |
| progress_dialog.js | Progress Dialog |

#### UI Update

| File Name | Description |
|:-:|:-|
| object_panel.js | Right Side Panel |
| webglapp_fs.js | WebGL Implementation |

#### Event

| File Name | Description |
|:-:|:-|
| menu.js | Menu (Click) Events |
| window_event.js | Define Events of window object |

#### Utility

| File Name | Description |
|:-:|:-|
| point_reader.js | xyz file parser |
| point_util.js | decimation point array function |

#### FindSurface

| File Name | Description |
|:-:|:-|
| find_surface.js | FindSurface Request Related Functions |

## Support

Send an email to support@curvsurf.com to contact our support team.









