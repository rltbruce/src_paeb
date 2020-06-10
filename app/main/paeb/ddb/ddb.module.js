(function ()
{
    'use strict';

    var tab = [
            
            'app.paeb.ddb.localisation',
            'app.paeb.ddb.acces_zone',
            'app.paeb.ddb.cisco',
            'app.paeb.ddb.ecole',
            'app.paeb.ddb.prestataires',
            'app.paeb.ddb.zone_subvention',
            'app.paeb.ddb.cout_subvention',
            'app.paeb.ddb.tranche_demande',
            'app.paeb.ddb.participant_formation_pr',
            'app.paeb.ddb.document',
            'app.paeb.ddb.phase_sous_projets',
            'app.paeb.ddb.etape_sousprojet',
            'app.paeb.ddb.agence_acc',
            'app.paeb.ddb.zap',
            'app.paeb.ddb.cadre_bordereau'

            ] ;

    angular
        .module('app.paeb.ddb', tab.sort())
        .run(testPermission)
        .config(config);
        var vs ;

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        /*msNavigationServiceProvider.saveItem('paeb.ddb', {
            title : 'Données de Bases',
            icon  : 'icon-data',
            weight: 2,
            hidden: function()
            {
                    return vs;
            }
        });*/



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
                var permissions = ["ADMIN"];
                var x =  loginService.gestionMenu(permissions,permission);        
                vs = x ;

            });
        }
     
    }

})();
