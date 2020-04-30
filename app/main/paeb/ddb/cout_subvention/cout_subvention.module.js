(function ()
{
    'use strict';

    angular
        .module('app.paeb.ddb.cout_subvention', [
            'app.paeb.ddb.cout_subvention.type_batiment',
            'app.paeb.ddb.cout_subvention.type_latrine',
            'app.paeb.ddb.cout_subvention.type_mobilier',
            'app.paeb.ddb.cout_subvention.type_cout_maitrise',
            'app.paeb.ddb.cout_subvention.type_cout_sousprojet',
            'app.paeb.ddb.cout_subvention.subvention_initial'
        ])
        .config(config);

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        msNavigationServiceProvider.saveItem('paeb.administration.donneesdebases.cout_subvention', {
            title : 'Cout subvention',
            icon  : 'icon-currency-usd',
            weight: 9
        });
    }

})();
