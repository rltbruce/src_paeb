(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_moe.suivi_financier_moe', [
            'app.paeb.gerer_situation_moe.suivi_financier_moe.suivi_financier_batiment_moe',
            'app.paeb.gerer_situation_moe.suivi_financier_moe.suivi_financier_latrine_moe',
            'app.paeb.gerer_situation_moe.suivi_financier_moe.suivi_financier_debut_travaux_moe',
            'app.paeb.gerer_situation_moe.suivi_financier_moe.suivi_financier_fin_travaux_moe'
            ])       
        .config(config);
        var vs ;

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        msNavigationServiceProvider.saveItem('paeb.gerer_situation_moe.suivi_financier_moe', {
            title : 'Suivi financier',
            icon  : 'icon-blur-radial',
            weight: 12
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
                var permissions = ["DDB"];
                var x =  loginService.gestionMenu(permissions,permission);        
                vs = x ;

            });
        }
     
    }

})();
