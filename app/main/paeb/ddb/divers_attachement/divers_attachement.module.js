(function ()
{
    'use strict';

    angular
        .module('app.paeb.ddb.divers_attachement', [
            'app.paeb.ddb.divers_attachement.divers_attachement_batiment',
            'app.paeb.ddb.divers_attachement.divers_attachement_latrine',
            'app.paeb.ddb.divers_attachement.divers_attachement_mobilier'
        ])
        .config(config);

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        msNavigationServiceProvider.saveItem('paeb.administration.donneesdebases.divers_attachement', {
            title : 'Attachements travaux',
            icon  : 'icon-format-list-numbers',
            weight: 11
        });
    }

})();
