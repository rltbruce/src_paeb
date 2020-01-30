(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_subvention_financiere.suivi_daaf_ufp', [			
            'app.paeb.gerer_subvention_financiere.suivi_daaf_ufp.suivi_financiere',
            ])       
        .config(config);
        var vs ;

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        msNavigationServiceProvider.saveItem('paeb.gerer_subvention_financiere.suivi_daaf_ufp', {
            title : 'Suivi DAAF/UFP',
            icon  : 'icon-data',
            weight: 6
        });



    }

})();
