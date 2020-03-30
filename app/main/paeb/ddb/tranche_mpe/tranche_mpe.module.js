(function ()
{
    'use strict';

    angular
        .module('app.paeb.ddb.tranche_mpe', [
            'app.paeb.ddb.tranche_mpe.tranche_demande_mpe',
            'app.paeb.ddb.tranche_mpe.tranche_demande_latrine_mpe',
            'app.paeb.ddb.tranche_mpe.tranche_demande_mobilier_mpe',
        ])
        .config(config);

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        msNavigationServiceProvider.saveItem('paeb.administration.donneesdebases.tranche_mpe', {
            title : 'Tranche D_MPE',
            icon  : 'icon-map-marker-multiple'
        });
    }

})();
