/**
 * App
 *
 * The main JavaScript file that runs Lush Gist.
 */

// Declare the global theme variable
var theme = {};

/**
 * Update settings.
 *
 * Update the setting values in the theme object as per the passed in values.
 */
var updateSetting = function( category, object, newValue ) {

  // Loop through the setting categories
  for ( var i = 0; i < theme.settings.length; i++ ) {

    // If the category matches, keep going
    if ( theme.settings[i][category] != undefined ) {

      // Loop through the categories setting objects
      for ( var i2 = 0; i2 < theme.settings[i][category].length; i2++ ) {

        // If the setting matches, keep going
        if ( theme.settings[i][category][i2][object] != undefined ) {

          // Update the setting to the new value
          theme.settings[i][category][i2][object].value = newValue;

        }

      }

    }

  }

}

/**
 * Build styles.
 *
 * Loop through the theme settings object and build out the styles for the Gist theme.
 */
var buildStyles = function() {

  var newStyles, setting, selector, property, value;

  newStyles = '';

  // Loop through the setting categories
  for ( var i = 0; i < theme.settings.length; i++ ) {

    // Loop through the categories setting objects
    for ( var i2 = 0; i2 < theme.settings[i][Object.keys( theme.settings[i] )[0]].length; i2++ ) {

      // Get the setting object
      setting  = theme.settings[i][Object.keys( theme.settings[i] )[0]][i2];
      setting  = setting[Object.keys( setting )[0]];

      // Save the selector, property and value
      selector = setting.selector;
      property = setting.property;
      value    = setting.value;

      // Add the new style declaration to the newStyles string.
      newStyles += selector + "{" + property + ":" + value + " !important}\r\n";

    }

  }

  // Add the extra, global styles
  newStyles += ".gist .gist-file .gist-data {border-radius: 2px 2px 0 0 !important}\r\n";
  newStyles += ".gist .gist-file .gist-meta {border-radius: 0 0 2px 2px !important}";

  // Set the values in the <style> block to style the preview Gist
  $( "#theme-styles" ).text( newStyles );

  // Set the styles in the download styles textbox
  $( "#download-styles" ).val( newStyles );

}

/**
 * document.ready
 */
$(function() {

  // Load settings.json
  $.getJSON( "assets/js/settings.json", function( data ) {

    // Save that data to theme.settings
    theme = data;

    // Remove the initial .loading class from .main
    $( ".main" ).removeClass( "loading" );

  });

  // Initialize the Iris color picker
  $( ".setting-input.color" ).iris({
    border: false,
    change: function() {

      // Cache $(this)
      var $this = $( this );

      // Save the setting category and object
      var category = $this.data( "setting-category" );
      var object   = $this.data( "setting-object" );

      // Save the value and replace double quotes with single quotes
      var value = $( this ).val();

      // Update the setting in the global object
      updateSetting( category, object, value );

      // Build the new styles
      buildStyles();

    }
  });

  // Hide Iris when you click anywhere on the document outside of it
  $( document ).click( function( e ) {

    // Make sure we're not dealing with a color input or the Iris picker itself
    if ( ! $( e.target ).is( ".setting-input.color, .iris-picker, .iris-picker-inner" ) ) {

      // Hide all instaces of Iris
      $( ".setting-input.color" ).iris( "hide" );

      // Prevent default action
      e.preventDefault();

    }

  });

  // Hide old Iris instances and show the new one when you click on color inputs
  $( ".setting-input.color" ).click( function( e ) {

    // Hide all the instances of Iris
    $( ".setting-input.color" ).iris( "hide" );

    // Show this one
    $( this ).iris( "show" );

    // Prevent default action
    e.preventDefault();

  });

  // Everytime the data in one of the setting input fields changes...
  $( ".setting-input" ).change( function() {

    // Cache $(this)
    var $this = $( this );

    // Save the setting category and object
    var category = $this.data( "setting-category" );
    var object   = $this.data( "setting-object" );

    // Save the value and replace double quotes with single quotes
    var value    = $( this ).val();
    value        = value.replace( '"', "'" );

    // Update the setting in the global object
    updateSetting( category, object, value );

    // Build the new styles
    buildStyles();

  });

  // When someone clicks inside of the styles textarea...
  $( "#download-styles" ).focus( function() {

    // Cache $(this)
    var $this = $(this);

    // Select contents of the textbox
    $this.select();

    // Work around Chrome's little problem
    $this.mouseup( function() {

      // Prevent further mouseup intervention
      $this.unbind( "mouseup" );

      return false;

    });

  });

});
