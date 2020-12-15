(function ()
{
    'use strict';

    angular
        .module('app.paeb.ddb.pv_constatation_rubrique', [
            'app.paeb.ddb.pv_constatation_rubrique.pv_constatation_rubrique_batiment',
            'app.paeb.ddb.pv_constatation_rubrique.pv_constatation_rubrique_latrine',
            'app.paeb.ddb.pv_constatation_rubrique.pv_constatation_rubrique_mobilier'
        ])
        .config(config);

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        msNavigationServiceProvider.saveItem('paeb.administration.donneesdebases.pv_constatation_rubrique', {
            title : 'Rubrique pv constatation',
            icon  : 'icon-format-list-numbers',
            weight: 11
        });
    }

})();
