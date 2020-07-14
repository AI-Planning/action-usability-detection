function analyzePlan() {

    var domText = window.ace.edit($('#domainSelection').find(':selected').val()).getSession().getValue();
    var probText = window.ace.edit($('#problemSelection').find(':selected').val()).getSession().getValue();

    $('#chooseFilesModal').modal('toggle');
    $('#plannerURLInput').show();
    window.toastr.info('Running analysis...');

    $.ajax( {url: "http://murmuring-waters-65390.herokuapp.com/solve",
             type: "POST",
             contentType: 'application/json',
             data: JSON.stringify({"domain": domText, "problem": probText})})
        .done(function (res) {
                console.log("server sucesses", res)
                if (res.status === 'ok')
                    window.toastr.success('Analysis complete!');
                else
                    window.toastr.error('Problem with the server.');

                showAnalysis(res.result.output);

            }).fail(function (res) {
                window.toastr.error('Error: Malformed URL?');
                console.log('server fail', res)
            });
}

function showAnalysis(output) {

    var tab_name = 'Analysis (' + (Object.keys(window.tl_analyses).length + 1) + ')';

    window.new_tab(tab_name, function(editor_name) {
        window.tl_analyses[editor_name] = output;
        var plan_html = '';
        plan_html += '<div class=\"plan-display\">\n';
        plan_html += '<h2>Action-reachability Output (<a target=\"_blank\" href=\"https://github.com/QuMuLab/action-reachability-via-deadend-detection/blob/master/README.md\">readme</a>)</h2>\n';
        plan_html += '<pre class=\"plan-display-action well\">\n';
        plan_html += output;
        plan_html += '</pre>';
        $('#' + editor_name).html(plan_html);
    });

}

define(function () {

    // Create a store for the Action-reachability analysis done
    window.tl_analyses = {};

    return {

        name: "Action-reachability",
        author: "Christian Muise, Qianyu Zhang",
        email: "christian.muise@gmail.com, qianyu.zhang@queensu.ca",
        description: "Action reachability via deadend detection in AI planning problems.",

        // This will be called whenever the plugin is loaded or enabled
        initialize: function() {

            // Add our button to the top menu
            window.add_menu_button('Action-reachability', 'Action-reachabilitytMenuItem', 'glyphicon-pawn', "chooseFiles('Action-reachability')");

            // Register this as a user of the file chooser interface
            window.register_file_chooser('Action-reachability',
            {
                showChoice: function() {
                    window.setup_file_chooser('Analyze', 'Analyze Problem');
                    $('#plannerURLInput').hide();
                },
                selectChoice: analyzePlan
            });
        },

        // This is called whenever the plugin is disabled
        disable: function() {
            window.remove_menu_button('Action-reachabilityMenuItem');
        },

        save: function() {
            // Used to save the plugin settings for later
            return {};
        },

        load: function(settings) {
            // Restore the plugin settings from a previous save call
        }

    };
});
