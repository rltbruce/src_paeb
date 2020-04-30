(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_subvention_financiere.suivi_daaf_ufp', [
            'app.paeb.gerer_subvention_financiere.suivi_daaf_ufp.suivi_financiere',
            'app.paeb.gerer_subvention_financiere.suivi_daaf_ufp.suivi_financiere_daaf_feffi',
            ])       
        .config(config);
        var vs ;

    /** @ngInject */
    function config(msNavigationServiceProvider)//Suivi DAAF/UFP
    {
        msNavigationServiceProvider.saveItem('paeb.gerer_subvention_financiere.suivi_daaf_ufp', {
            title : 'Suivi Financement',
            icon  : 'icon-data',
            weight: 6
        });

    }

})();
