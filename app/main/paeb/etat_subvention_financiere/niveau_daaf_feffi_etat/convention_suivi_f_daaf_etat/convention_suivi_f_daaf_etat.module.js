(function ()
{
    'use strict';

    angular
        .module('app.paeb.etat_subvention_financiere.niveau_daaf_feffi_etat.convention_suivi_f_daaf_etat', [])
        .config(config);
        var vs = {};
        var affichage;
    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_etat_subvention_financiere_niveau_daaf_feffi_etat_convention_suivi_f_daaf_etat', {
            url      : '/donnees-de-base/etat_subvention_financiere/niveau_daaf_feffi_etat/convention_suivi_f_daaf_etat',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/etat_subvention_financiere/niveau_daaf_feffi_etat/convention_suivi_f_daaf_etat/convention_suivi_f_daaf_etat.html',
                    controller : 'Convention_suivi_f_daaf_etatController as vm'
                }
            },
            bodyClass: 'convention_suivi_f_daaf_etat',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "convention_suivi_f_daaf_etat"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.etat_subvention_financiere.niveau_daaf_feffi_etat.convention_suivi_f_daaf_etat', {
            title: 'Etat financier DAAF/FEFFI',
            icon  : 'icon-rotate-3d',
            state: 'app.paeb_etat_subvention_financiere_niveau_daaf_feffi_etat_convention_suivi_f_daaf_etat',
            weight: 1
        });
    }

})();
