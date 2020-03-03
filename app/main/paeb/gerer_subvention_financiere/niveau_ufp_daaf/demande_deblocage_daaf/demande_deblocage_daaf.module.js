(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_subvention_financiere.niveau_ufp_daaf.demande_deblocage_daaf', [])
        .run(testPermission)
        .config(config);
        var vs ;
    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_gerer_subvention_financiere_niveau_ufp_daaf_demande_deblocage_daaf', {
            url      : '/donnees-de-base/gerer_subvention_financiere/niveau_ufp_daaf/demande_deblocage_daaf',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/gerer_subvention_financiere/niveau_ufp_daaf/demande_deblocage_daaf/demande_deblocage_daaf.html',
                    controller : 'Demande_deblocage_daafController as vm'
                }
            },
            bodyClass: 'demande_deblocage_daaf',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "demande_deblocage_daaf"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.gerer_subvention_financiere.niveau_ufp_daaf.demande_deblocage_daaf', {
            title: 'Saisie Demande daaf',
            icon  : 'icon-tile-four',
            state: 'app.paeb_gerer_subvention_financiere_niveau_ufp_daaf_demande_deblocage_daaf',
            weight: 1,
            hidden: function()
            {
                    return vs;
            }
        });
    }

    function testPermission(loginService,$cookieStore,apiFactory)
    {
        var id_user = $cookieStore.get('id');
       
        var permission = [];
        if (id_user > 0) 
        {
            apiFactory.getOne("utilisateurs/index", id_user).then(function(result) 
            {
                var user = result.data.response;
               

                var permission = user.roles;
                var permissions = ["DAAF","ODAAF"];
                var x =  loginService.gestionMenu(permissions,permission);        
                vs = x ;

            });
        }
     
    }

})();
