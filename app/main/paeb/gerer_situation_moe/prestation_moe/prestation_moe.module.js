(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_moe.prestation_moe', [
            'app.paeb.gerer_situation_moe.prestation_moe.memoire_technique',
            'app.paeb.gerer_situation_moe.prestation_moe.appel_offre',
            'app.paeb.gerer_situation_moe.prestation_moe.rapport_mensuel',
            'app.paeb.gerer_situation_moe.prestation_moe.manuel_gestion',
            'app.paeb.gerer_situation_moe.prestation_moe.police_assurance'
            ])       
        .config(config);
        var vs ;

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        msNavigationServiceProvider.saveItem('paeb.gerer_situation_moe.prestation_moe', {
            title : 'Prestation MOE',
            icon  : 'icon-data',
            weight: 3
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
