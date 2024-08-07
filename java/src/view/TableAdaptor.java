package view;

import model.User;
import service.API;
import util.Const;
import util.JSONUtils;

import javax.swing.*;
import javax.swing.table.DefaultTableCellRenderer;
import javax.swing.table.JTableHeader;
import java.awt.*;
import java.awt.event.MouseEvent;
import java.awt.event.MouseListener;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.concurrent.ExecutionException;

public class TableAdaptor extends JTable{

   private JTable jTable = new JTable();
   private TableModalAdaptor usersTableModal;
   private JPanel jPanel;
   private JScrollPane scrollPaneForTable;
   private List<User> usersList = new ArrayList<User>();

   public TableAdaptor(JPanel panel) {

      jPanel = panel;
      GetUsersListWorker getUsersListWorker = new GetUsersListWorker();
      getUsersListWorker.execute();

      // Initialize the table model
      usersTableModal = new TableModalAdaptor(usersList);
      jTable.setRowHeight(Const.rowHeight);
      jTable.setModel(usersTableModal);
      jTable.setSelectionBackground(Color.gray);


      // Add styles to table header
      JTableHeader jTableHeader = jTable.getTableHeader();
      jTableHeader.setOpaque(false);
      jTableHeader.setBackground(Color.black);
      jTableHeader.setFont(new Font("SansSerif", Font.BOLD, 12));
      jTableHeader.setForeground(Color.white);
      jTableHeader.setPreferredSize(new Dimension(Const.windowWidth, 40));

      // center the texts in cells
      DefaultTableCellRenderer jTableRender = (DefaultTableCellRenderer)
              jTable.getDefaultRenderer(String.class);
      jTableRender.setHorizontalAlignment(SwingConstants.CENTER);
      DefaultTableCellRenderer jHeaderRenderer = (DefaultTableCellRenderer)
              jTable.getTableHeader().getDefaultRenderer();
      jHeaderRenderer.setHorizontalAlignment(JLabel.CENTER);

      // Set remove buttons in the table and customize styles of columns
      jTable.getColumn(Const.removeText).setCellRenderer(new TableCellAdaptor());
      jTable.getColumn(Const.removeText).setPreferredWidth(20);
      jTable.getColumn(Const.isAdminText).setPreferredWidth(40);
      jTable.getColumn(Const.articlesNumText).setPreferredWidth(40);
      this.addActionsToRows();

      // This is essential for showing titles
      scrollPaneForTable = new JScrollPane(jTable);
      scrollPaneForTable.setPreferredSize(new Dimension(Const.windowWidth, Const.windowHeight - 30));
      jPanel.add(scrollPaneForTable);
   }

   public void removeScrollPaneForTable() {
      scrollPaneForTable.hide();
      jPanel.remove(scrollPaneForTable);
   }
   /**
    *  Initialize worker for  getting users data from API
    */
   public class GetUsersListWorker extends SwingWorker<List<User>, Void> {
      @Override
      protected List<User> doInBackground() throws Exception {
         List<Object> responseList  = API.getInstance().getUsersList();
         for (int i = 0; i < responseList.size(); i++) {
            String item = JSONUtils.toJSON(responseList.get(i));
            LinkedHashMap user = JSONUtils.toObject(item, LinkedHashMap.class);
            usersList.add(new User(user));
         }
         return usersList;
      }

      @Override
      protected void done() {
         try {
            usersTableModal.update(get());
         } catch (InterruptedException e) {
            e.printStackTrace();
         } catch (ExecutionException e) {
            e.printStackTrace();
         }
      }
   }

   /**
    * Initialize the worker for deleting user through API
    */
   public class DeleteRowWorker extends SwingWorker<Integer, Void>{
      private String _username;
      private int _index;

      public DeleteRowWorker(String username, int index) {
         this._username = username;
         this._index = index;
      }

      @Override
      protected Integer doInBackground() throws Exception {
         int statusCode = API.getInstance().deleteUser(this._username);
         return statusCode;
      }

      @Override
      protected void done() {
         try {
            if (get() == 204) {
               usersList.remove(this._index);
               usersTableModal.update(usersList);
            } else {
               System.out.println(get());
            }
         } catch (InterruptedException e) {
            e.printStackTrace();
         } catch (ExecutionException e) {
            e.printStackTrace();
         }
      }
   }

   /**
    * Add MouseActions to rows
    */
   public void addActionsToRows() {
      jTable.addMouseListener(new MouseListener() {
         @Override
         public void mouseClicked(MouseEvent e) {
            // Get the current row and col.
            Point point = e.getPoint();
            int row = jTable.rowAtPoint(point);
            int col = jTable.columnAtPoint(point);

            // If the column clicked is the delete button, it will delete this line.
            if (col == usersTableModal.getColumnCount() - 1) {
               DeleteRowWorker deleteRowWorker = new DeleteRowWorker(usersList.get(row).getFullName(), row);
               deleteRowWorker.execute();
            }
         }

         @Override
         public void mousePressed(MouseEvent e) {

         }

         @Override
         public void mouseReleased(MouseEvent e) {

         }

         @Override
         public void mouseEntered(MouseEvent e) {

         }

         @Override
         public void mouseExited(MouseEvent e) {

         }
      });
   }
}
