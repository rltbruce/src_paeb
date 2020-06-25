(function ()
{
    'use strict';

    angular
        .module('app.paeb.ddb.prestataires', [
            'app.paeb.ddb.prestataires.prestataire',
            'app.paeb.ddb.prestataires.partenaire_relai',
            'app.paeb.ddb.prestataires.bureau_etude',
        ])
        .config(config);

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        msNavigationServiceProvider.saveItem('paeb.administration.donneesdebases.prestataires', {
            title : 'Prestataire',
            icon  : 'icon-worker',
            weight: 8
        });
    }

})();
